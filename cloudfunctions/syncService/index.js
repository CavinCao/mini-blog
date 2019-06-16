// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.Env })
const rp = require('request-promise');
const dateUtils = require('date-utils')
const db = cloud.database()
const _ = db.command
const APPID = process.env.AppId
const APPSCREAT = process.env.AppSecret


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await syncWechatPosts(false)
  //TODO:暂时注释：2019-05-09(cloud.openapi.wxacode.getUnlimited)云调用暂不支持云端测试和定时触发器，只能由小程序端触发
  //await syncPostQrCode()
}

/**
 * 同步公众号文章至云数据库
 */
async function syncWechatPosts(isUpdate) {
  let configData = await getConfigInfo("syncWeChatPosts");
  if (configData == null) {
    console.info("未获取相应的配置")
    return;
  }
  let collection = "mini_posts"
  let accessToken = await getCacheAccessToken(1)
  var offset = parseInt(configData.value.currentOffset);
  let maxCount = parseInt(configData.value.maxSyncCount);
  var count = 10
  var isContinue = true
  while (isContinue) {
    var posts = await getWechatPosts(accessToken, offset, count)
    console.info(posts.item.length)
    if (posts.item.length == 0) {
      isContinue = false;
      let data = { currentOffset: 0, maxSyncCount: 10 }
      await db.collection("mini_config").doc(configData._id).update({
        data: {
          value: data
        }
      });
      break;
    }

    for (var index in posts.item) {
      //判断是否存在
      let existPost = await db.collection(collection).where(
        {
          uniqueId: posts.item[index].media_id,
          sourceFrom: "wechat"
        }).get();

      if (existPost.code) {
        continue;
      }
      if (!existPost.data.length) {
        let dt = new Date(posts.item[index].update_time * 1000);
        let createTime = dt.toFormat("YYYY-MM-DD")
        //移除公众号代码片段序号
        let content = posts.item[index].content.news_item[0].content.replace(/<ul class="code-snippet__line-index code-snippet__js".*?<\/ul>/g, '')
        //替换图片data-url
        content = content.replace(/data-src/g, "src")

        //替换新媒体管家样式问题
        content = content.replace(/<span style="color:rgba(0, 0, 0, 0);"><span style="line-height: inherit;margin-right: auto;margin-left: auto;border-radius: 4px;">/g, "")

        var data = {
          uniqueId: posts.item[index].media_id,
          sourceFrom: "wechat",
          content: content,
          author: posts.item[index].content.news_item[0].author,
          title: posts.item[index].content.news_item[0].title,
          defaultImageUrl: posts.item[index].content.news_item[0].thumb_url,
          createTime: createTime,
          timestamp: posts.item[index].update_time,
          totalComments: 0,//总的点评数
          totalVisits: 100,//总的访问数
          totalZans: 50,//总的点赞数
          label: [],//标签
          classify: 0,//分类
          contentType: "html",
          digest: posts.item[index].content.news_item[0].digest,//摘要
          isShow: 1,//是否展示
          originalUrl: posts.item[index].content.news_item[0].url,
          totalCollection: 10 + Math.floor(Math.random() * 40)
        }

        await db.collection(collection).add({
          data: data
        });
      }
      else {
        //不需要更新直接继续
        if (!isUpdate) {
          continue
        }

        //移除公众号代码片段序号
        let content = posts.item[index].content.news_item[0].content.replace(/<ul class="code-snippet__line-index code-snippet__js".*?<\/ul>/g, '')
        //替换图片data-url
        content = content.replace(/data-src/g, "src")

        //替换新媒体管家样式问题
        content = content.replace(/<span style="color:rgba(0, 0, 0, 0);"><span style="line-height: inherit;margin-right: auto;margin-left: auto;border-radius: 4px;">/g, "")


        let id = existPost.data[0]._id;
        await db.collection(collection).doc(id).update({
          data: {
            content: content,
            author: posts.item[index].content.news_item[0].author,
            title: posts.item[index].content.news_item[0].title,
            defaultImageUrl: posts.item[index].content.news_item[0].thumb_url,
            originalUrl: posts.item[index].content.news_item[0].url,
            totalCollection: 10 + Math.floor(Math.random() * 40)
          }
        });

      }
    }
    if (offset > maxCount) {
      return;
    }
    offset = offset + count
  }


}
/**
 * 获取缓存过的token
 * @param {} type 
 */
async function getCacheAccessToken(type) {
  let collection = "access_token"
  let gapTime = 300000
  let result = await db.collection(collection).where({ type: type }).get();
  if (result.code) {
    return null;
  }
  if (!result.data.length) {
    let accessTokenBody = await getAccessWechatToken();
    await db.collection(collection).add({
      data: {
        accessToken: accessTokenBody.access_token,
        expiresIn: accessTokenBody.expires_in * 1000,
        createTime: Date.now(),
        type: type
      }
    });
    return accessTokenBody.access_token;
  }
  else {
    let data = result.data[0];
    let {
      _id,
      accessToken,
      expiresIn,
      createTime,
      type
    } = data;

    // access_token 依然有效
    if (Date.now() < createTime + expiresIn - gapTime) {
      return accessToken;
    }
    // 失效，重新拉取
    else {
      let accessTokenBody = await getAccessWechatToken();
      await db.collection(collection).doc(_id).set({
        data: {
          accessToken: accessTokenBody.access_token,
          expiresIn: accessTokenBody.expires_in * 1000,
          createTime: Date.now(),
          type: type
        }
      });
      return accessTokenBody.access_token;
    }
  }
}
/**
 * 获取公众号token
 * @param {}  
 */
async function getAccessWechatToken() {
  const result = await rp({
    url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=${APPID}&secret=${APPSCREAT}`,
    method: 'GET'
  });

  //TODO:需要验证IP白名单失效问题（ip改变导致无法获取到token）
  console.info(result)
  let rbody = (typeof result === 'object') ? result : JSON.parse(result);
  return rbody;
}

/**
 * 获取公众号文章信息
 * @param {*} accessToken
 */
async function getWechatPosts(accessToken, offset, count) {
  let url = `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${accessToken}`
  var options = {
    method: 'POST',
    json: true,
    uri: url,
    body: {
      "type": "news",
      "offset": offset,
      "count": count
    }
  }
  const result = await rp(options)
  let rbody = (typeof result === 'object') ? result : JSON.parse(result);
  return rbody;
}

/**
 * 同步文章的小程序码
 */
async function syncPostQrCode() {

  let configData = await getConfigInfo("syncPostQrCode");
  if (configData == null) {
    console.info("未获取相应的配置")
    return;
  }
  console.info(configData)
  let page = parseInt(configData.value.currentOffset);
  let maxCount = parseInt(configData.value.maxSyncCount);
  let isContinue = true;
  while (isContinue) {

    let posts = await db.collection('mini_posts')
      .orderBy('timestamp', 'asc')
      .skip(page * 10)
      .limit(10)
      .field({
        _id: true,
        qrCode: true,
        timestamp: true
      }).get()

    console.info(posts)

    if (posts.data.length == 0) {
      isContinue = false;
      break;
    }

    for (var index in posts.data) {
      if (posts.data[index].qrCode != null) {
        continue
      }

      let scene = 'timestamp=' + posts.data[index].timestamp;
      let result = await cloud.openapi.wxacode.getUnlimited({
        scene: scene,
        page: 'pages/detail/detail'
      })

      if (result.errCode === 0) {
        const upload = await cloud.uploadFile({
          cloudPath: posts.data[index]._id + '.png',
          fileContent: result.buffer,
        })

        await db.collection("mini_posts").doc(posts.data[index]._id).update({
          data: {
            qrCode: upload.fileID
          }
        });
      }
    }
    if ((page - parseInt(configData.value.currentOffset)) * 10 > maxCount) {
      isContinue = false;
    }
    else {
      page++
    }
  }

  let data = { currentOffset: page - 1, maxSyncCount: 100 }
  await db.collection("mini_config").doc(configData._id).update({
    data: {
      value: data
    }
  });

}

/**
 * 获取同步数据配置信息
 * @param {} key 
 */
async function getConfigInfo(key) {
  /**
   * 1.同步公众号文章 key：syncWeChatPosts
   * 2.生成文章小程序码 key:syncPostQrCode
   */
  let collection = "mini_config";
  let result = await db.collection(collection).where({ key: key }).get();
  if (result.data.length === 0) {
    let value = { currentOffset: 0, maxSyncCount: 0 }
    let data = {
      key: key,
      value: value,
      timestamp: Date.now()
    }
    //初始化一笔配置,从1开始，最大执行数量为100
    await db.collection(collection).add({
      data: data
    })
    return data
  }
  else {
    return result.data[0];
  }

}