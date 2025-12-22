/**
 * 会员数据模型
 * 纯粹的数据结构定义，不绑定特定数据源
 * 数据转换逻辑由各个 Service 实现负责
 */
class Member {
  constructor(data = {}) {
    this.id = data.id || ''
    this.openId = data.openId || ''
    this.nickName = data.nickName || ''
    this.avatarUrl = data.avatarUrl || ''
    this.points = data.points || 0
    this.isVip = data.isVip || false
    this.totalSignedCount = data.totalSignedCount || 0
    this.continueSignedCount = data.continueSignedCount || 0
    this.lastSignedDate = data.lastSignedDate || ''
    this.level = data.level || 1
    this.applyStatus = data.applyStatus || 0
    this.modifyTime = data.modifyTime || 0
  }

  /**
   * 是否为 VIP
   * @returns {boolean}
   */
  isVipMember() {
    return this.isVip === true
  }

  /**
   * 转换为简化格式
   * @returns {Object}
   */
  toSimple() {
    return {
      id: this.id,
      openId: this.openId,
      nickName: this.nickName,
      avatarUrl: this.avatarUrl,
      points: this.points,
      isVip: this.isVip,
      isVipMember: this.isVipMember()
    }
  }
}

module.exports = Member
