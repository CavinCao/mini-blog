// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.Env })
const rp = require('request-promise');
const dateUtils = require('date-utils')
const db = cloud.database()
const _ = db.command
const RELEASE_LOG_KEY = 'releaseLogKey'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'checkAuthor': {
      return checkAuthor(event)
    }
    case 'addReleaseLog': {
      return addReleaseLog(event)
    }
    default: break
  }
}

/**
 * 验证
 * @param {} event 
 */
async function checkAuthor(event) {
  if (event.userInfo.openId == process.env.author) {
    return true;
  }
  return false;
}

/**
 * 新增版本日志
 * @param {*} event 
 */
async function addReleaseLog(event) {
  try {
    let collection = 'mini_logs'
    let data = {
      key: RELEASE_LOG_KEY,
      content: event.log,
      title: event.title,
      path: '../mine/release/release',
      timestamp: Date.now(),
      openId: '',//为空则为所有用户
      type: 'system'
    }
    await db.collection(collection).add({
      data: data
    })
    return true;
  }
  catch (e) {
    console.info(e)
    return false;
  }

}