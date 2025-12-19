// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.Env })
const db = cloud.database()
const _ = db.command
const dateUtils = require('date-utils')


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'addSign': {
      return addSign(event)
    }
    case 'getSignedDetail': {
      return getSignedDetail(event)
    }
    case 'addPoints': {
      return addPoints(event)
    }
    case 'applyVip': {
      return applyVip(event)
    }
    case 'addShareDetail': {
      return addShareDetail(event)
    }
    case 'addSignAgain':{
      return addSignAgain(event)
    }
    case 'saveMemberInfo': {
      return saveMemberInfo(event)
    }
    case 'getMemberUserInfo': {
      return getMemberUserInfo(event)
    }
    default: break
  }
}

async function addSignAgain(event)
{
  try {
    const wxContext = cloud.getWXContext()
    let memberInfos = await db.collection('mini_member').where({
      openId: wxContext.OPENID
    }).get();

    const tasks = []
    let pointCount = 1

    if (memberInfos.data.length === 0) {
      let task1 = db.collection('mini_member').add({
        data: {
          openId: wxContext.OPENID,
          totalSignedCount: 1,//累计签到数
          continueSignedCount: 1,//持续签到
          totalPoints: 1,//积分
          lastSignedDate: "",//最后一次签到日期
          level: 1,//会员等级（预留）
          unreadMessgeCount: 0,//未读消息（预留）
          modifyTime: new Date().getTime(),
          avatarUrl: event.info.avatarUrl,//头像
          nickName: event.info.nickName,//昵称
          sighRightCount:_.inc(-1),
          applyStatus: 0//申请状态 0:默认 1:申请中 2:申请通过 3:申请驳回
        }
      })
      tasks.push(task1)
    }
    else {
      let memberInfo = memberInfos.data[0]
      let continueSignedCount = memberInfo.continueSignedCount + 1

      pointCount = continueSignedCount
      if (continueSignedCount > 30) {
        pointCount = 30
      }

      let task2 = db.collection('mini_member').doc(memberInfo._id).update({
        data: {
          totalSignedCount: _.inc(1),
          continueSignedCount: continueSignedCount,
          totalPoints: _.inc(pointCount),
          sighRightCount:_.inc(-1),
          modifyTime: new Date().getTime()
        }
      });
      tasks.push(task2)
    }

    //签到明细
    let task3 = db.collection('mini_sign_detail').add({
      data: {
        openId: wxContext.OPENID,
        year: event.info.year.toString(),
        month: event.info.month.toString(),
        day: event.info.day.toString(),
        createTime: new Date().getTime()
      }
    })
    tasks.push(task3)

    //积分明细
    let task5 = db.collection('mini_point_detail').add({
      data: {
        openId: wxContext.OPENID,
        operateType: 0,//0:获得 1:使用 2:过期
        count: pointCount,
        desc: "签到得积分",
        date: (new Date()).toFormat("YYYY-MM-DD HH24:MI:SS"),
        createTime: new Date().getTime()
      }
    })
    tasks.push(task5)
    await Promise.all(tasks)
    return true
  }
  catch (e) {
    console.error(e)
    return false
  }
}

/**
 * 新增签到
 * @param {} event 
 */
async function addSign(event) {

  console.info("addSign")

  try {
    let memberInfos = await db.collection('mini_member').where({
      openId: event.info.openId
    }).get();

    const tasks = []
    let pointCount = 1
    let date = new Date().toFormat("YYYY-MM-DD")
    if (memberInfos.data.length === 0) {
      let task1 = db.collection('mini_member').add({
        data: {
          openId: event.info.openId,
          totalSignedCount: 1,//累计签到数
          continueSignedCount: 1,//持续签到
          totalPoints: 1,//积分
          lastSignedDate: date,//最后一次签到日期
          level: 1,//会员等级（预留）
          unreadMessgeCount: 0,//未读消息（预留）
          modifyTime: new Date().getTime(),
          avatarUrl: event.info.avatarUrl,//头像
          nickName: event.info.nickName,//昵称
          applyStatus: 0//申请状态 0:默认 1:申请中 2:申请通过 3:申请驳回
        }
      })
      tasks.push(task1)
    }
    else {
      let continueSignedCount = 1
      let memberInfo = memberInfos.data[0]
      if (new Date().addDays(-1).toFormat("YYYY-MM-DD") == memberInfo.lastSignedDate) {
        continueSignedCount = memberInfo.continueSignedCount + 1
      }

      pointCount = continueSignedCount
      if (continueSignedCount > 30) {
        pointCount = 30
      }

      let task2 = db.collection('mini_member').doc(memberInfo._id).update({
        data: {
          totalSignedCount: _.inc(1),
          continueSignedCount: continueSignedCount,
          totalPoints: _.inc(pointCount),
          lastSignedDate: date,
          modifyTime: new Date().getTime()
        }
      });
      tasks.push(task2)
    }

    //签到明细
    let date1 = new Date().toFormat("YYYY-M-D").split("-")
    let task3 = db.collection('mini_sign_detail').add({
      data: {
        openId: event.info.openId,
        year: date1[0],
        month: date1[1],
        day: date1[2],
        createTime: new Date().getTime()
      }
    })
    tasks.push(task3)

    //如果统一订阅签到通知
    if (event.info.accept == 'accept') {
      let task4 = await db.collection("mini_subcribute").add({
        data: {
          templateId: event.info.templateId,
          openId: event.info.openId,
          timestamp: new Date().getTime()
        }
      });
      tasks.push(task4)
    }

    //积分明细
    let task5 = db.collection('mini_point_detail').add({
      data: {
        openId: event.info.openId,
        operateType: 0,//0:获得 1:使用 2:过期
        count: pointCount,
        desc: "签到得积分",
        date: (new Date()).toFormat("YYYY-MM-DD HH24:MI:SS"),
        createTime: new Date().getTime()
      }
    })
    tasks.push(task5)
    await Promise.all(tasks)
    return true
  }
  catch (e) {
    console.error(e)
    return false
  }
}

/**
 * 获取签到明细
 * @param {}  
 */
async function getSignedDetail(event) {

  const wxContext = cloud.getWXContext()
  console.info(event)
  let res = await db.collection('mini_sign_detail')
    .where({
      openId: wxContext.OPENID,
      year: event.year,
      month: event.month
    })
    .limit(100)
    .get()
  return res.data
}

/**
 * 新增积分
 * @param {} event 
 */
async function addPoints(event) {
  console.info("addPoints")
  try {
    const wxContext = cloud.getWXContext()
    const tasks = []
    let pointCount = 0;
    let desc = ""
    let operateType = 0
    let sighRight=false
    let highRight=false

    switch (event.taskType) {
      case 'taskVideo': {
        pointCount = 50
        desc = "完成观看视频任务奖励"
        break
      }
      case 'taskRead': {
        pointCount = 1
        desc = "阅读文章奖励"
        break
      }
      case 'readPost': {
        pointCount = -20
        desc = "跳过广告阅读文章"
        operateType = 1
        break
      }
      case 'forgetSignRight':{
        pointCount = -200
        desc = "漏签到补签权益"
        operateType = 1
        sighRight=true
        break
      }
      case 'highNicknameRight':{
        pointCount = -10000
        desc = "昵称永久高亮"
        operateType = 1
        highRight=true
        break
      }
      default: break
    }

    let memberInfos = await db.collection('mini_member').where({
      openId: wxContext.OPENID
    }).get();

    if (memberInfos.data.length === 0) {
      let task1 = db.collection('mini_member').add({
        data: {
          openId: wxContext.OPENID,
          totalSignedCount: 0,//累计签到数
          continueSignedCount: 0,//持续签到
          totalPoints: pointCount,//积分
          lastSignedDate: '',//最后一次签到日期
          level: 1,//会员等级（预留）
          unreadMessgeCount: 0,//未读消息（预留）
          modifyTime: new Date().getTime(),
          avatarUrl: event.info.avatarUrl,//头像
          nickName: event.info.nickName,//昵称
          applyStatus: 0,//申请状态 0:默认 1:申请中 2:申请通过 3:申请驳回
          sighRightCount:sighRight?1:0,
          highRight:highRight
        }
      })
      tasks.push(task1)
    }
    else {
      let sighRightCount=sighRight?1:0
      let memberInfo = memberInfos.data[0]
      let task2 = db.collection('mini_member').doc(memberInfo._id).update({
        data: {
          totalPoints: _.inc(pointCount),
          modifyTime: new Date().getTime(),
          sighRightCount:_.inc(sighRightCount),
          highRight:highRight?true:memberInfo.highRight
        }
      });
      tasks.push(task2)
    }

    //积分明细
    let task3 = db.collection('mini_point_detail').add({
      data: {
        openId: wxContext.OPENID,
        operateType: 0,//0:获得 1:使用 2:过期
        count: pointCount,
        desc: desc,
        date: (new Date()).toFormat("YYYY-MM-DD HH24:MI:SS"),
        createTime: new Date().getTime()
      }
    })
    tasks.push(task3)
    await Promise.all(tasks)
    return true
  }
  catch (e) {
    console.error(e)
    return false
  }
}

/**
 * 申请VIP
 * @param {} event 
 */
async function applyVip(event) {

  console.info("applyVip")
  console.info(event)
  try {
    const wxContext = cloud.getWXContext()
    let memberInfos = await db.collection('mini_member').where({
      openId: wxContext.OPENID
    }).get();

    if (memberInfos.data.length === 0) {
      await db.collection('mini_member').add({
        data: {
          openId: wxContext.OPENID,
          totalSignedCount: 0,//累计签到数
          continueSignedCount: 0,//持续签到
          totalPoints: 0,//积分
          lastSignedDate: '',//最后一次签到日期
          level: 1,//会员等级（预留）
          unreadMessgeCount: 0,//未读消息（预留）
          modifyTime: new Date().getTime(),
          avatarUrl: event.info.avatarUrl,//头像
          nickName: event.info.nickName,//昵称
          applyStatus: 1//申请状态 0:默认 1:申请中 2:申请通过 3:申请驳回
        }
      })
    }
    else {
      let memberInfo = memberInfos.data[0]
      await db.collection('mini_member').doc(memberInfo._id).update({
        data: {
          applyStatus: 1,
          avatarUrl: event.info.avatarUrl,//兼容下老数据
          nickName: event.info.nickName,
          modifyTime: new Date().getTime()
        }
      });
    }
    //如果统一订阅签到通知
    if (event.info.accept == 'accept') {
      await db.collection("mini_subcribute").add({
        data: {
          templateId: event.info.templateId,
          openId: wxContext.OPENID,
          timestamp: new Date().getTime()
        }
      });
    }
    return true;
  }
  catch (e) {
    console.error(e)
    return false
  }
}

/**
 * 新增分享数据
 * @param {*} event 
 */
async function addShareDetail(event) {
  const wxContext = cloud.getWXContext()
  if (wxContext.OPENID == event.info.shareOpenId) {
    return true;
  }
  let shareInfos = await db.collection('mini_share_detail').where({
    openId: wxContext.OPENID,
    shareOpenId: event.info.shareOpenId
  }).get();
  if (shareInfos.data.length > 0) {
    return true;
  }
  else {

    try {

      let memberInfos = await db.collection('mini_member').where({
        openId: event.info.shareOpenId
      }).get();

      const tasks = []
      if (memberInfos.data.length === 0) {
        let task1 = db.collection('mini_member').add({
          data: {
            openId: event.info.openId,
            totalSignedCount: 0,//累计签到数
            continueSignedCount: 0,//持续签到
            totalPoints: 100,//积分
            lastSignedDate: '',//最后一次签到日期
            level: 1,//会员等级（预留）
            unreadMessgeCount: 0,//未读消息（预留）
            modifyTime: new Date().getTime(),
            applyStatus: 0//申请状态 0:默认 1:申请中 2:申请通过 3:申请驳回
          }
        })
        tasks.push(task1)
      }
      else {
        let memberInfo = memberInfos.data[0]
        let task2 = db.collection('mini_member').doc(memberInfo._id).update({
          data: {
            totalPoints: _.inc(100),
            modifyTime: new Date().getTime()
          }
        });
        tasks.push(task2)
      }

      let task3 = db.collection('mini_share_detail').add({
        data: {
          shareOpenId: event.info.shareOpenId,
          openId: wxContext.OPENID,
          avatarUrl: event.info.avatarUrl,//头像
          nickName: event.info.nickName,//昵称
          date: (new Date()).toFormat("YYYY-MM-DD"),
          createTime: new Date().getTime()
        }
      })
      tasks.push(task3)

      //积分明细
      let task5 = db.collection('mini_point_detail').add({
        data: {
          openId: event.info.openId,
          operateType: 0,//0:获得 1:使用 2:过期
          count: 100,
          desc: "邀请好友得积分",
          date: (new Date()).toFormat("YYYY-MM-DD HH24:MI:SS"),
          createTime: new Date().getTime()
        }
      })
      tasks.push(task5)
      await Promise.all(tasks)
      return true
    }
    catch (e) {
      console.error(e)
      return false
    }
  }
}

/**
 * 保存用户头像和昵称信息
 * @param {*} event 
 */
async function saveMemberInfo(event) {
  console.info("saveMemberInfo")
  try {
    const openId = event.userInfo.openId
    
    let memberInfos = await db.collection('mini_member').where({
      openId: openId
    }).get();

    if (memberInfos.data.length === 0) {
      // 新增用户信息
      await db.collection('mini_member').add({
        data: {
          openId: openId,
          totalSignedCount: 0,
          continueSignedCount: 0,
          totalPoints: 0,
          lastSignedDate: '',
          level: 1,
          unreadMessgeCount: 0,
          modifyTime: new Date().getTime(),
          avatarUrl: event.avatarUrl,
          nickName: event.nickName,
          applyStatus: 0,
          sighRightCount: 0,
          highRight: false
        }
      })
    } else {
      // 更新用户信息
      let memberInfo = memberInfos.data[0]
      await db.collection('mini_member').doc(memberInfo._id).update({
        data: {
          avatarUrl: event.avatarUrl,
          nickName: event.nickName,
          modifyTime: new Date().getTime()
        }
      })
    }
    return {
      success: true,
      avatarUrl: event.avatarUrl,
      nickName: event.nickName
    }
  } catch (e) {
    console.error(e)
    return {
      success: false,
      error: e
    }
  }
}

/**
 * 获取用户头像和昵称信息
 * @param {*} event 
 */
async function getMemberUserInfo(event) {
  console.info("getMemberUserInfo")
  try {
    const openId = event.userInfo.openId
    
    let memberInfos = await db.collection('mini_member').where({
      openId: openId
    }).get();

    if (memberInfos.data.length > 0) {
      const memberInfo = memberInfos.data[0]
      return {
        success: true,
        avatarUrl: memberInfo.avatarUrl,
        nickName: memberInfo.nickName
      }
    } else {
      return {
        success: false,
        message: '用户信息不存在'
      }
    }
  } catch (e) {
    console.error(e)
    return {
      success: false,
      error: e
    }
  }
}