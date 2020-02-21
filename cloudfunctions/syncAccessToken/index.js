// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: process.env.Env
})
const rp = require('request-promise');
const dateUtils = require('date-utils')
const db = cloud.database()
const _ = db.command
const APPID = process.env.AppId
const APPSCREAT = process.env.AppSecret
const BMOBKEY = process.env.BmobKey
const BMOBPWD = process.env.BmobPwd
const WECHAT_URL = "https://api.weixin.qq.com";

// 云函数入口函数
exports.main = async(event, context) => {

  let token = await getCacheAccessToken(2)
  console.info(token)
  await postTokenToOther(token)
}


async function getCacheAccessToken(type) {
  let collection = "access_token"
  let gapTime = 300000
  let result = await db.collection(collection).where({
    type: type
  }).get();
  if (result.code) {
    return null;
  }
  if (!result.data.length) {
    let accessTokenBody = await getAccessWechatToken(APPID, APPSCREAT);
    await db.collection(collection).add({
      data: {
        accessToken: accessTokenBody.access_token,
        expiresIn: accessTokenBody.expires_in * 1000,
        createTime: Date.now(),
        type: type
      }
    });
    return accessTokenBody.access_token;
  } else {
    let data = result.data[0];
    let {
      _id,
      accessToken,
      expiresIn,
      createTime,
      type
    } = data;

    let accessTokenBody = await getAccessWechatToken(APPID, APPSCREAT);
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
/**
 * @param {}  
 */
async function getAccessWechatToken(appId, appScreat) {
  const result = await rp({
    url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=${appId}&secret=${appScreat}`,
    method: 'GET'
  });

  let rbody = (typeof result === 'object') ? result : JSON.parse(result);
  return rbody;
}

async function postTokenToBmob(token) {
  let appId = BMOBKEY
  let apiKey = BMOBPWD
  var options = {
    method: 'PUT',
    uri: `https://api2.bmob.cn/1/classes/token/X2RgBBBO`,
    body: {
      accessToken: token
    },
    headers: {
      'User-Agent': 'Request-Promise',
      'X-Bmob-Application-Id': appId,
      'X-Bmob-REST-API-Key': apiKey
    },
    json: true
  };
  let result = await rp(options)
  console.info(result);
}

async function postTokenToOther(token) {
  let appId = BMOBKEY
  let apiKey = BMOBPWD
  let accessTokenBody = await getAccessWechatToken(BMOBKEY, BMOBPWD)
  console.info(accessTokenBody)
  var url = `${WECHAT_URL}/tcb/invokecloudfunction?access_token=${accessTokenBody.access_token}&env=env-034d6b&name=syncAccessToken`
  let data={
    token: token
  }
  var options = {
    method: 'POST',
    uri: url,
    body: data,
    json: true
  };
  let result = await rp(options)
  console.info(result);
}