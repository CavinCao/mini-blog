// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.Env })
const db = cloud.database()
const _ = db.command

const dateUtils = require('date-utils')

const SIGN_TEMPLATE_ID = 'J-MZ6Zrd08TobUgWPbjQcnJt9BHbc9M-nOOxirC8nWA'

// 云函数入口函数
exports.main = async (event, context) => {
  await sendSubscribeMessage()
}

/**
 * 发送订阅消息
 * @param {} event 
 */
async function sendSubscribeMessage() {

  let date=Date.today()
  let timestamp=date.getTime()

  while (true) {
    var templateInfo = await db.collection('mini_subcribute').where({
      templateId: SIGN_TEMPLATE_ID,
      timestamp:_.lt(timestamp)
    }).limit(100).get()

    console.info(templateInfo)

    if (templateInfo.code) {
      return;
    }
    if (!templateInfo.data.length) {
      return;
    }


    for (var i = 0; i < templateInfo.data.length; i++) {
      try {
        const result = await cloud.openapi.subscribeMessage.send({
          touser: templateInfo.data[i].openId,
          page: 'pages/mine/mine',
          data: {
            thing1: {
              value: '每日签到'
            },
            thing2: {
              value: '点击立即签到'
            }
          },
          templateId: templateInfo.data[i].templateId
        })
        console.log(result)
      } catch (err) {
        console.log(err)
      }
      await db.collection('mini_subcribute').doc(templateInfo.data[i]._id).remove()
    }
  }
}

