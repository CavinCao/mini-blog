// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const rp = require('request-promise');
const db = cloud.database()
const _ = db.command

const APPID = process.env.AppId
const APPSCREAT = process.env.AppSecret


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await syncWechatPosts(false)
}

/**
 * 同步公众号文章至云数据库
 */
async function syncWechatPosts(isUpdate) {
  let collection = "mini_posts"
  let accessToken = await getCacheAccessToken(1)
  var offset = 0
  var count = 10
  var isContinue = true
  while (isContinue) {
    var posts = await getWechatPosts(accessToken, offset, count)
    if (posts.item.length == 0) {
      isContinue = false
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

        var data = {
          uniqueId: posts.item[index].media_id,
          sourceFrom: "wechat",
          content: posts.item[index].content.news_item[0].content,
          author: posts.item[index].content.news_item[0].author,
          title: posts.item[index].content.news_item[0].title,
          defaultImageUrl: posts.item[index].content.news_item[0].thumb_url,
          createTime: posts.item[index].update_time,
          totalComments: 0,//总的点评数
          totalVisits: 100,//总的访问数
          totalZans: 50,//总的点赞数
          label: [],//标签
          classify: 0//分类
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

        let id = existPost.data[0]._id;
        await db.collection(collection).doc(id).set({
          data: {
            content: posts.item[index].content.news_item[0].content,
            author: posts.item[index].content.news_item[0].author,
            title: posts.item[index].content.news_item[0].title,
            defaultImageUrl: posts.item[index].content.news_item[0].thumb_url,
            createTime: posts.item[index].update_time
          }
        });

      }
    }

    offset=offset+count
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