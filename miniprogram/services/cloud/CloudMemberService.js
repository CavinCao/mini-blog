const IMemberService = require('../interfaces/IMemberService.js')
const BaseCloudService = require('./BaseCloudService.js')
const Member = require('../../models/Member.js')

/**
 * 会员服务 - 云开发实现
 */
class CloudMemberService extends BaseCloudService {
  constructor() {
    super()
  }

  /**
   * 获取会员信息
   */
  async getMemberInfo(openId) {
    const result = await this.db.collection('mini_member')
      .where({
        openId: openId
      })
      .limit(1)
      .get()

    if (result.data && result.data.length > 0) {
      return this._convertToMember(result.data[0])
    }
    return null
  }

  /**
   * 将云数据库数据转换为 Member 对象
   * @private
   */
  _convertToMember(cloudData) {
    if (!cloudData) return null
    
    return new Member({
      id: cloudData._id,
      openId: cloudData.openId,
      nickName: cloudData.nickName,
      avatarUrl: cloudData.avatarUrl,
      points: cloudData.totalPoints || 0,
      isVip: cloudData.applyStatus === 2,  // 2 表示 VIP 通过
      totalSignedCount: cloudData.totalSignedCount || 0,
      continueSignedCount: cloudData.continueSignedCount || 0,
      lastSignedDate: cloudData.lastSignedDate || '',
      level: cloudData.level || 1,
      applyStatus: cloudData.applyStatus || 0,
      modifyTime: cloudData.modifyTime || 0
    })
  }

  /**
   * 获取会员用户信息
   */
  async getMemberUserInfo() {
    return await this.callFunction('memberService', {
      action: "getMemberUserInfo"
    })
  }

  /**
   * 保存会员信息
   */
  async saveMemberInfo(avatarUrl, nickName) {
    return await this.callFunction('memberService', {
      action: "saveMemberInfo",
      avatarUrl: avatarUrl,
      nickName: nickName
    })
  }

  /**
   * 获取会员列表
   */
  async getMemberInfoList(page, applyStatus) {
    const result = await this.db.collection('mini_member')
      .where({
        applyStatus: applyStatus
      })
      .orderBy('modifyTime', 'desc')
      .skip((page - 1) * 10)
      .limit(10)
      .get()

    return result.data.map(cloudData => this._convertToMember(cloudData))
  }

  /**
   * 新增签到
   */
  async addSign(info) {
    return await this.callFunction('memberService', {
      action: "addSign",
      info: info
    })
  }

  /**
   * 补签
   */
  async addSignAgain(info) {
    return await this.callFunction('memberService', {
      action: "addSignAgain",
      info: info
    })
  }

  /**
   * 获取签到详情
   */
  async getSignedDetail(openId, year, month) {
    return await this.callFunction('memberService', {
      action: "getSignedDetail",
      openId: openId,
      year: year,
      month: month
    })
  }

  /**
   * 新增积分
   */
  async addPoints(taskType, info) {
    return await this.callFunction('memberService', {
      action: "addPoints",
      taskType: taskType,
      info: info
    })
  }

  /**
   * 获取积分明细列表
   */
  async getPointsDetailList(page, openId) {
    return await this.db.collection('mini_point_detail')
      .where({
        openId: openId
      })
      .orderBy('createTime', 'desc')
      .skip((page - 1) * 20)
      .limit(20)
      .get()
  }

  /**
   * 申请VIP
   */
  async applyVip(info) {
    return await this.callFunction('memberService', {
      action: "applyVip",
      info: info
    })
  }

  /**
   * 新增分享明细
   */
  async addShareDetail(info) {
    return await this.callFunction('memberService', {
      action: "addShareDetail",
      info: info
    })
  }

  /**
   * 获取分享明细列表
   */
  async getShareDetailList(openId, date) {
    return await this.db.collection('mini_share_detail')
      .where({
        shareOpenId: openId,
        date: date
      })
      .limit(5)
      .get()
  }
}

module.exports = CloudMemberService

