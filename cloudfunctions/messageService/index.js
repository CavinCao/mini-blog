// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.Env })
const dateUtils = require('date-utils')
const db = cloud.database()
const _ = db.command

//收到评论通知
const template = 'cwYd6eGpQ8y7xcVsYWuTSC-FAsAyv5KOAVGvjJIdI9Q'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  switch (event.action) {
    case 'sendTemplateMessage': {
      return sendTemplateMessage(event)
    }
    case 'removeExpireFormId': {
      return removeExpireFormId(event)
    }
    case 'queryFormIds': {
      return queryFormIds(event)
    }
    case 'addFormIds': {
      return addFormIds(event)
    }
    default: break
  }
}


/**
 * 发送通知消息
 * @param  event 
 */
async function sendTemplateMessage(event) {

  var touser = "";
  var form_id = "";
  var openId = event.tOpenId == "" ? process.env.author : event.tOpenId

  var openIdformIds = await db.collection('mini_formids').where({
    openId: openId
  }).limit(1).get()
  if (openIdformIds.code) {
    return;
  }
  if (!openIdformIds.data.length) {
    return;
  }
  touser = openIdformIds.data[0]['openId']
  form_id = openIdformIds.data[0]['formId']
  console.info("openId:" + touser + ";formId:" + form_id)

  const removeResult = await db.collection('mini_formids').doc(openIdformIds.data[0]['_id']).remove()
  console.info(event.nickName + ":" + event.message)

  const sendResult = await cloud.openapi.templateMessage.send({
    touser: touser,
    templateId: template,
    formId: form_id,
    page: 'pages/detail/detail?id=' + event.blogId,
    data: {
      keyword1: {
        value: event.nickName
      },
      keyword2: {
        value: event.message
      },
      keyword3: {
        value: new Date().toFormat("YYYY-MM-DD HH24:MI:SS")
      }
    },
  })
  return sendResult
}
/**
 * 获取总的formIds和过期的formIds
 * @param {} event 
 */
async function queryFormIds(event) {
  var data = {}
  var formIdsResult = await db.collection('mini_formids').where({
    openId: process.env.author // 填入当前用户 openid
  }).count()

  /*var formIdsExpireResult = await db.collection('mini_formids').where({
    openId: process.env.author, // 填入当前用户 openid
    timestamp: _.lt(new Date().removeDays(7).getTime())
  }).count()*/

  data.formIds = formIdsResult.total
  //data.expireFromIds = formIdsExpireResult.total
  return data;
}

/**
 * 删除过期的formID
 * @param {} event 
 */
async function removeExpireFormId(event) {
  try {
    return await db.collection('mini_formids').where({
      timestamp: _.lt(new Date().removeDays(7).getTime())
    }).remove()
  } catch (e) {
    console.error(e)
  }
}

/**
 * 新增formId
 * @param {} event 
 */
async function addFormIds(event) {
  try {

    let removeRes = await db.collection('mini_formids').where({
      timestamp: _.lt(new Date().removeDays(7).getTime())
    }).remove()

    console.info(removeRes)

    for (var i = 0; i < event.formIds.length; i++) {
      let data = {
        openId: event.userInfo.openId,
        formId: event.formIds[i],
        timestamp: new Date().getTime()
      }

      let res = await db.collection('mini_formids').add({
        data: data
      })
      console.info(res)
    }
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
}
