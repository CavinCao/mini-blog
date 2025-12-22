/**
 * 会员服务接口
 * 所有会员相关的服务实现都必须实现此接口
 */
class IMemberService {
  /**
   * 获取会员信息
   * @param {string} openId - 用户openId
   * @returns {Promise<Member>}
   */
  async getMemberInfo(openId) {
    throw new Error('Method not implemented: getMemberInfo')
  }

  /**
   * 获取会员用户信息
   * @returns {Promise<Object>}
   */
  async getMemberUserInfo() {
    throw new Error('Method not implemented: getMemberUserInfo')
  }

  /**
   * 保存会员信息
   * @param {string} avatarUrl - 头像URL
   * @param {string} nickName - 昵称
   * @returns {Promise<Object>}
   */
  async saveMemberInfo(avatarUrl, nickName) {
    throw new Error('Method not implemented: saveMemberInfo')
  }

  /**
   * 获取会员列表
   * @param {number} page - 页码
   * @param {number} applyStatus - 申请状态
   * @returns {Promise<Array<Member>>}
   */
  async getMemberInfoList(page, applyStatus) {
    throw new Error('Method not implemented: getMemberInfoList')
  }

  /**
   * 新增签到
   * @param {Object} info - 签到信息
   * @returns {Promise<Object>}
   */
  async addSign(info) {
    throw new Error('Method not implemented: addSign')
  }

  /**
   * 补签
   * @param {Object} info - 签到信息
   * @returns {Promise<Object>}
   */
  async addSignAgain(info) {
    throw new Error('Method not implemented: addSignAgain')
  }

  /**
   * 获取签到详情
   * @param {string} openId - 用户openId
   * @param {number} year - 年份
   * @param {number} month - 月份
   * @returns {Promise<Object>}
   */
  async getSignedDetail(openId, year, month) {
    throw new Error('Method not implemented: getSignedDetail')
  }

  /**
   * 新增积分
   * @param {string} taskType - 任务类型
   * @param {Object} info - 积分信息
   * @returns {Promise<Object>}
   */
  async addPoints(taskType, info) {
    throw new Error('Method not implemented: addPoints')
  }

  /**
   * 获取积分明细列表
   * @param {number} page - 页码
   * @param {string} openId - 用户openId
   * @returns {Promise<Array>}
   */
  async getPointsDetailList(page, openId) {
    throw new Error('Method not implemented: getPointsDetailList')
  }

  /**
   * 申请VIP
   * @param {Object} info - 申请信息
   * @returns {Promise<Object>}
   */
  async applyVip(info) {
    throw new Error('Method not implemented: applyVip')
  }

  /**
   * 新增分享明细
   * @param {Object} info - 分享信息
   * @returns {Promise<Object>}
   */
  async addShareDetail(info) {
    throw new Error('Method not implemented: addShareDetail')
  }

  /**
   * 获取分享明细列表
   * @param {string} openId - 用户openId
   * @param {string} date - 日期
   * @returns {Promise<Array>}
   */
  async getShareDetailList(openId, date) {
    throw new Error('Method not implemented: getShareDetailList')
  }
}

module.exports = IMemberService

