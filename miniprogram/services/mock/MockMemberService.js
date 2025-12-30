const IMemberService = require('../interfaces/IMemberService.js')
const BaseMockService = require('./BaseMockService.js')
const Member = require('../../models/Member.js')

/**
 * 会员服务 - Mock 实现
 */
class MockMemberService extends BaseMockService {
  constructor() {
    super()
    this.memberInfo = {
      _id: 'mock_user_1',
      openId: 'mock_openid_123456',
      nickName: 'Mock User',
      avatarUrl: 'https://i.pravatar.cc/150?u=mock',
      points: 1000,
      level: 1,
      isVip: true,
      createTime: Date.now()
    }
    this.signData = []
    this.pointsDetail = []
    this.shareDetail = []
  }

  async getMemberInfo(openId) {
    await this._simulateDelay()
    return new Member({
      id: this.memberInfo._id,
      ...this.memberInfo
    })
  }

  async getMemberUserInfo() {
    await this._simulateDelay()
    return this._success(this.memberInfo)
  }

  async saveMemberInfo(avatarUrl, nickName) {
    await this._simulateDelay()
    this.memberInfo.avatarUrl = avatarUrl
    this.memberInfo.nickName = nickName
    return this._success()
  }

  async getMemberInfoList(page, applyStatus) {
    await this._simulateDelay()
    return [new Member({ id: 'mock_1', nickName: '测试用户1', avatarUrl: 'https://i.pravatar.cc/150?u=1' })]
  }

  async addSign(info) {
    await this._simulateDelay()
    this.signData.push({ ...info, createTime: Date.now() })
    return this._success()
  }

  async addSignAgain(info) {
    await this._simulateDelay()
    return this.addSign(info)
  }

  async getSignedDetail(openId, year, month) {
    await this._simulateDelay()
    return this._success(this.signData)
  }

  async addPoints(taskType, info) {
    await this._simulateDelay()
    this.memberInfo.points += 10
    this.pointsDetail.unshift({ taskType, ...info, createTime: Date.now(), points: 10 })
    return this._success()
  }

  async getPointsDetailList(page, openId) {
    await this._simulateDelay()
    return this.pointsDetail.slice((page - 1) * 10, page * 10)
  }

  async applyVip(info) {
    await this._simulateDelay()
    return this._success()
  }

  async addShareDetail(info) {
    await this._simulateDelay()
    this.shareDetail.push({ ...info, createTime: Date.now() })
    return this._success()
  }

  async getShareDetailList(openId, date) {
    await this._simulateDelay()
    return this.shareDetail
  }
}

module.exports = MockMemberService

