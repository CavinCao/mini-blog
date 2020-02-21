// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.Env })
const dateUtils = require('date-utils')
const db = cloud.database()
const _ = db.command

//收到评论通知
const template = 'cwYd6eGpQ8y7xcVsYWuTSC-FAsAyv5KOAVGvjJIdI9Q'

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
    case 'querySubscribeCount': {
      return querySubscribeCount(event)
    }
    case 'addFormIds': {
      return addFormIds(event)
    }
    case 'sendSubscribeMessage': {
      return sendSubscribeMessage(event)
    }
    case 'getTemplateList': {
      return getTemplateList(event)
    }
    case 'addSubscribeCount': {
      return addSubscribeCount(event)
    }
    default: break
  }
}

/**
 * 发送订阅消息
 * @param {} event 
 */
async function sendSubscribeMessage(event) {

  console.info(event)
  var openId = ""
  if (event.tOpenId == "") {
    openId = process.env.author
  }
  else if (event.tOpenId == event.cOpenId) {
    openId = process.env.author
  }
  else{
    openId=event.tOpenId
  }

  var templateInfo = await db.collection('mini_subcribute').where({
    openId: openId,
    templateId: event.templateId
  }).limit(1).get()

  if (templateInfo.code) {
    return;
  }
  if (!templateInfo.data.length) {
    return;
  }

  let nickName=event.nickName.replace(/\d+/g,'')

  await db.collection('mini_subcribute').doc(templateInfo.data[0]['_id']).remove()

  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: openId,
      page: event.page,
      data: {
        name1: {
          value: nickName
        },
        thing2: {
          value: event.content
        },
        time3: {
          value: event.createDate
        }
      },
      templateId: event.templateId
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
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
async function querySubscribeCount(event) {
  var data = {}
  var formIdsResult = await db.collection('mini_subcribute').where({
    openId: process.env.author, // 填入当前用户 openid
    templateId: event.templateId,
  }).count()

  data.formIds = formIdsResult.total
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
async function addSubscribeCount(event) {
  try {

    for (var i = 0; i < event.templateIds.length; i++) {
      let data = {
        openId: event.userInfo.openId,
        templateId: event.templateIds[i],
        timestamp: new Date().getTime()
      }

      let res = await db.collection('mini_subcribute').add({
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

/**
 * 获取当前帐号下的个人模板列表
 * @param {*} event 
 */
async function getTemplateList(event) {
  try {
    const result = await cloud.openapi.subscribeMessage.getTemplateList()
    return result
  } catch (err) {
    return err
  }
}
