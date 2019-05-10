// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.Env })
const rp = require('request-promise');
const dateUtils = require('date-utils')
const db = cloud.database()
const _ = db.command

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  switch (event.action) {
    case 'sendTemplateMessage': {
      return sendTemplateMessage(event)
    }
    case 'checkAuthor': {
      return checkAuthor(event)
    }
    case 'removeExpireFormId': {
      return removeExpireFormId(event)
    }
    case 'queryFormIds': {
      return queryFormIds(event)
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
    _openid: openId
  }).limit(1).get()
  if (openIdformIds.code) {
    return;
  }
  if (!openIdformIds.data.length) {
    return;
  }
  touser = openIdformIds.data[0]['_openid']
  form_id = openIdformIds.data[0]['formId']
  console.info("openId:"+touser+";formId:"+form_id)

  const removeResult = await db.collection('mini_formids').doc(openIdformIds.data[0]['_id']).remove()
  console.info(event.nickName + ":" + event.message)

  const sendResult = await cloud.openapi.templateMessage.send({
    touser: touser,
    templateId: template,
    formId: form_id,
    page: 'pages/detail/detail?blogId=' + event.blogId,
    data: {
      keyword1: {
        value: event.nickName
      },
      keyword2: {
        value: event.createTime
      },
      keyword2: {
        value: event.message
      }
    },
  })
  return sendResult
}