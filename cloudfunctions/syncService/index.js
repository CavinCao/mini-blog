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
  switch (event.action) {
    case 'searchGitHub': {
      return await searchGitHub(event)
    }
    case 'getGitHubRepo': {
      return await getGitHubRepo(event)
    }
    case 'getGitHubReadme': {
      return await getGitHubReadme(event)
    }
    case 'getGitHubContents': {
      return await getGitHubContents(event)
    }
    case 'getGitHubBranches': {
      return await getGitHubBranches(event)
    }
    case 'getGitHubIssues': {
      return await getGitHubIssues(event)
    }
    case 'manualSyncArticle': {
      return await manualSyncArticle(event)
    }
  }

  return { success: false, message: '未知的操作类型' }
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
  var offset = parseInt(configData.value.currentOffset);
  let maxCount = parseInt(configData.value.maxSyncCount);
  var count = 10
  var isContinue = true
  while (isContinue) {
    var posts = await getWechatPosts(offset, count)
    console.info(posts.item.length)
    if (posts.item.length == 0) {
      isContinue = false;
      let data = { currentOffset: offset, maxSyncCount: maxCount }
      await db.collection("mini_config").doc(configData._id).update({
        data: {
          value: data
        }
      });
      break;
    }

    for (var index in posts.item) {

      console.info("title:"+posts.item[index].content.newsItem[0].title)
      //判断是否存在
      let existPost = await db.collection(collection).where(
        {
          uniqueId: posts.item[index].mediaId,
          sourceFrom: "wechat"
        }).get();

      if (existPost.code) {
        continue;
      }
      if (!existPost.data.length) {
        let dt = new Date(posts.item[index].updateTime * 1000);
        let createTime = dt.toFormat("YYYY-MM-DD")
        //移除公众号代码片段序号
        let content = posts.item[index].content.newsItem[0].content.replace(/<ul class="code-snippet__line-index code-snippet__js".*?<\/ul>/g, '')
        //替换图片data-url
        content = content.replace(/data-src/g, "src")

        //替换新媒体管家样式问题
        content = content.replace(/<span style="color:rgba(0, 0, 0, 0);"><span style="line-height: inherit;margin-right: auto;margin-left: auto;border-radius: 4px;">/g, "")

        var data = {
          uniqueId: posts.item[index].mediaId,
          sourceFrom: "wechat",
          content: content,
          author: posts.item[index].content.newsItem[0].author,
          title: posts.item[index].content.newsItem[0].title,
          defaultImageUrl: posts.item[index].content.newsItem[0].thumbUrl,
          createTime: createTime,
          timestamp: posts.item[index].updateTime,
          totalComments: 0,//总的点评数
          totalVisits: 100,//总的访问数
          totalZans: 50,//总的点赞数
          label: [],//标签
          classify: 0,//分类
          contentType: "html",
          digest: posts.item[index].content.newsItem[0].digest,//摘要
          isShow: 1,//是否展示
          originalUrl: posts.item[index].content.newsItem[0].url,
          totalCollection: 10 + Math.floor(Math.random() * 40)
        }

        await db.collection(collection).add({
          data: data
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
async function getWechatPosts(offset, count) {
  const result = await cloud.openapi({ appid: APPID }).officialAccount.material.batchGetMaterial({
    "type": "news",
    "offset": offset,
    "count": count
  })
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
    let value = { currentOffset: 0, maxSyncCount: 100 }
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
/**
 * 获取 GitHub 仓库详情
 * @param {*} event 
 */
async function getGitHubRepo(event) {
  let { fullName } = event;
  try {
    const result = await rp({
      url: `https://api.github.com/repos/${fullName}`,
      headers: {
        'User-Agent': 'Mini-Blog-WeChat-App'
      },
      json: true
    });
    return result;
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

/**
 * 获取 GitHub 仓库 Readme
 * @param {*} event 
 */
async function getGitHubReadme(event) {
  let { fullName } = event;
  try {
    const result = await rp({
      url: `https://api.github.com/repos/${fullName}/readme`,
      headers: {
        'User-Agent': 'Mini-Blog-WeChat-App'
      },
      json: true
    });
    
    if (result.content && result.encoding === 'base64') {
        return Buffer.from(result.content, 'base64').toString('utf-8');
    }
    return "";

  } catch (err) {
    console.error(err);
    return "";
  }
}

/**
 * 获取 GitHub 仓库内容
 * @param {*} event 
 */
async function getGitHubContents(event) {
  let { fullName, path, ref } = event;
  let url = `https://api.github.com/repos/${fullName}/contents`;
  if (path) {
      url += `/${path}`;
  }
  
  let qs = {};
  if (ref) {
      qs.ref = ref;
  }

  try {
    const result = await rp({
      url: url,
      qs: qs,
      headers: {
        'User-Agent': 'Mini-Blog-WeChat-App'
      },
      json: true
    });
    return result;
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

/**
 * 获取 GitHub 仓库分支列表
 * @param {*} event 
 */
async function getGitHubBranches(event) {
  let { fullName } = event;
  try {
     const result = await rp({
      url: `https://api.github.com/repos/${fullName}/branches`,
      headers: {
        'User-Agent': 'Mini-Blog-WeChat-App'
      },
      json: true
    });
    return result;
  }
  catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

/**
 * 搜索 GitHub 仓库
 * @param {*} event 
 */
async function searchGitHub(event) {
  let { keyword, page } = event;
  if (!page) page = 1;
  
  try {
    const result = await rp({
      url: `https://api.github.com/search/repositories`,
      qs: {
        q: keyword,
        sort: 'stars',
        order: 'desc',
        page: page,
        per_page: 20
      },
      headers: {
        'User-Agent': 'Mini-Blog-WeChat-App'
      },
      json: true
    });
    return result;
  } catch (err) {
    console.error(err);
    return { items: [], total_count: 0, error: err.message };
  }
}

/**
 * 获取 GitHub 仓库 Issues
 * @param {*} event 
 */
async function getGitHubIssues(event) {
  let { fullName, state, page } = event;
  if (!page) page = 1;
  if (!state) state = 'open';

  try {
    const result = await rp({
      url: `https://api.github.com/repos/${fullName}/issues`,
      qs: {
        state: state,
        page: page,
        per_page: 20,
        sort: 'updated'
      },
      headers: {
        'User-Agent': 'Mini-Blog-WeChat-App'
      },
      json: true
    });
    return result;
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

/**
 * 手动同步文章
 * @param {*} event 
 */
async function manualSyncArticle(event) {
  const { articleUrl, defaultImageUrl } = event;
  const wxContext = cloud.getWXContext();
  
  try {
    console.info('开始手动同步文章:', articleUrl);
    
    // 验证URL
    if (!articleUrl || articleUrl === '') {
      return { success: false, message: '文章链接不能为空' };
    }

    if (!defaultImageUrl || defaultImageUrl === '') {
      return { success: false, message: '默认图片不能为空' };
    }

    // 获取文章HTML内容
    let htmlContent = '';
    try {
      const result = await rp({
        url: articleUrl,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      htmlContent = result;
    } catch (err) {
      console.error('获取文章内容失败:', err);
      return { success: false, message: '无法获取文章内容，请检查链接是否正确' };
    }

    // 解析文章标题和内容
    let title = '';
    let content = '';
    let author = '';
    let digest = '';

    // 优先从变量中提取标题（最准确）
    const titleMatch1 = htmlContent.match(/var\s+msg_title\s*=\s*["']([^"']+)["']/i);
    const titleMatch2 = htmlContent.match(/id="activity-name"[^>]*>(.*?)<\/h[1-6]>/is);
    const titleMatch3 = htmlContent.match(/<h1[^>]*class="rich_media_title"[^>]*>(.*?)<\/h1>/is);
    
    if (titleMatch1 && titleMatch1[1]) {
      title = titleMatch1[1].trim();
    } else if (titleMatch2 && titleMatch2[1]) {
      title = titleMatch2[1].trim().replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    } else if (titleMatch3 && titleMatch3[1]) {
      title = titleMatch3[1].trim().replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }

    // 优先从js_name提取作者（页面昵称），然后是meta标签中的author
    const authorMatch1 = htmlContent.match(/id="js_name"[^>]*>(.*?)<\/a>/is);
    const authorMatch2 = htmlContent.match(/<meta\s+name="author"\s+content="([^"]+)"/i);
    const authorMatch3 = htmlContent.match(/var\s+nickname\s*=\s*["']([^"']+)["']/i);
    
    if (authorMatch1 && authorMatch1[1]) {
      // 提取纯文本，去除HTML标签
      author = authorMatch1[1].trim().replace(/<[^>]+>/g, '').trim();
      // 如果作者名包含"生活"等词，尝试提取更简洁的版本（如Bug生活2048 -> Bug2048）
      const simpleAuthorMatch = author.match(/(Bug\d+)/i);
      if (simpleAuthorMatch) {
        author = simpleAuthorMatch[1];
      }
    } else if (authorMatch2 && authorMatch2[1]) {
      author = authorMatch2[1].trim();
    } else if (authorMatch3 && authorMatch3[1]) {
      author = authorMatch3[1].trim();
    }

    // 提取正文内容（公众号文章的内容通常在 id="js_content" 的div中）
    const contentMatch = htmlContent.match(/<div\s+class="rich_media_content\s+"\s+id="js_content"[^>]*>([\s\S]*?)<\/div>\s*<script/i) ||
                         htmlContent.match(/<div[^>]+id="js_content"[^>]*>([\s\S]*?)<\/div>/i);
    
    if (contentMatch && contentMatch[1]) {
      content = contentMatch[1].trim();
      
      // 清理和优化内容
      // 移除代码片段的行号标记（这些是干扰显示的点）
      content = content.replace(/<ul\s+class="code-snippet__line-index[^"]*"[^>]*>.*?<\/ul>/gs, '');
      
      // 移除script标签
      content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      
      // 移除style标签
      content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
      
      // 替换data-src为src（微信公众号图片懒加载）
      content = content.replace(/data-src=/g, 'src=');
      
      // 移除data-开头的属性（保留基本HTML结构）
      content = content.replace(/\s+data-[a-z-]+="[^"]*"/gi, '');
      
      // 移除一些微信特有的属性
      content = content.replace(/\s+data-slate-[a-z-]+="[^"]*"/gi, '');
      
      // 清理空的span标签和无意义的标记
      content = content.replace(/<span\s+style="font-size:\s*0px;[^"]*"[^>]*>.*?<\/span>/gi, '');
    } else {
      return { success: false, message: '无法解析文章内容，可能不是有效的公众号文章链接' };
    }

    // 提取摘要（从content中提取前200字符的纯文本）
    const textContent = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    digest = textContent.substring(0, 200);

    // 如果没有提取到标题，使用摘要的前30字符
    if (!title || title === '') {
      title = textContent.substring(0, 30) + '...';
    }

    // 检查文章是否已存在（通过URL判断）
    const existPost = await db.collection('mini_posts').where({
      originalUrl: articleUrl
    }).get();

    if (existPost.data && existPost.data.length > 0) {
      return { success: false, message: '该文章已存在，请勿重复添加' };
    }

    // 保存到数据库
    const timestamp = Date.now();
    const createTime = new Date(timestamp).toFormat("YYYY-MM-DD");
    
    const postData = {
      uniqueId: `manual_${timestamp}`,
      sourceFrom: 'manual',
      content: content,
      author: author || '未知',
      title: title,
      defaultImageUrl: defaultImageUrl,
      createTime: createTime,
      timestamp: timestamp,
      totalComments: 0,
      totalVisits: 0,
      totalZans: 0,
      label: [],
      classify: 0,
      contentType: 'html',
      digest: digest,
      isShow: 1,
      originalUrl: articleUrl,
      totalCollection: 0,
      createBy: wxContext.OPENID
    };

    const addResult = await db.collection('mini_posts').add({
      data: postData
    });

    if (addResult._id) {
      console.info('手动同步文章成功:', addResult._id);
      return { 
        success: true, 
        message: '文章同步成功',
        postId: addResult._id,
        title: title
      };
    } else {
      throw new Error('保存文章失败');
    }

  } catch (err) {
    console.error('手动同步文章异常:', err);
    return { 
      success: false, 
      message: err.message || '同步失败，请稍后重试'
    };
  }
}
