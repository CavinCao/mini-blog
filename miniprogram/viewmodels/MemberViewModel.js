const BaseViewModel = require('./base/BaseViewModel.js')
const Response = require('./base/Response.js')
const ServiceFactory = require('../services/ServiceFactory.js')

/**
 * 会员 ViewModel
 * 封装会员相关的业务逻辑
 */
class MemberViewModel extends BaseViewModel {
  constructor() {
    super()
    this.memberService = ServiceFactory.getMemberService()
  }

  /**
   * 获取会员信息
   * @param {string} openId - 用户openId
   * @returns {Promise<Response>}
   */
  async getMemberInfo(openId) {
    try {
      const member = await this.memberService.getMemberInfo(openId)
      return Response.success(member ? member.toSimple() : null)
    } catch (error) {
      const message = this.handleError(error, '获取会员信息失败')
      return Response.error(message)
    }
  }

  /**
   * 获取会员用户信息
   * @returns {Promise<Response>}
   */
  async getMemberUserInfo() {
    try {
      // Service 已经返回 Response 对象
      return await this.memberService.getMemberUserInfo()
    } catch (error) {
      const message = this.handleError(error, '获取用户信息失败')
      return Response.error(message)
    }
  }

  /**
   * 保存会员信息
   * @param {string} avatarUrl - 头像URL
   * @param {string} nickName - 昵称
   * @returns {Promise<Response>}
   */
  async saveMemberInfo(avatarUrl, nickName) {
    try {
      // Service 已经返回 Response 对象
      return await this.memberService.saveMemberInfo(avatarUrl, nickName)
    } catch (error) {
      const message = this.handleError(error, '保存用户信息失败')
      return Response.error(message)
    }
  }

  /**
   * 获取会员列表
   * @param {number} page - 页码
   * @param {number} applyStatus - 申请状态
   * @returns {Promise<Response>}
   */
  async getMemberInfoList(page, applyStatus) {
    try {
      const members = await this.memberService.getMemberInfoList(page, applyStatus)
      
      return Response.success({
        list: members.map(member => member.toSimple()),
        hasMore: members.length >= 10,
        isEmpty: members.length === 0 && page === 1
      })
    } catch (error) {
      const message = this.handleError(error, '获取会员列表失败')
      return Response.error(message)
    }
  }

  /**
   * 新增签到
   * @param {Object} info - 签到信息
   * @returns {Promise<Response>}
   */
  async addSign(info) {
    try {
      const result = await this.memberService.addSign(info)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '签到失败')
      return Response.error(message)
    }
  }

  /**
   * 补签
   * @param {Object} info - 签到信息
   * @returns {Promise<Response>}
   */
  async addSignAgain(info) {
    try {
      const result = await this.memberService.addSignAgain(info)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '补签失败')
      return Response.error(message)
    }
  }

  /**
   * 获取签到详情
   * @param {string} openId - 用户openId
   * @param {number} year - 年份
   * @param {number} month - 月份
   * @returns {Promise<Response>}
   */
  async getSignedDetail(openId, year, month) {
    try {
      const result = await this.memberService.getSignedDetail(openId, year, month)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '获取签到详情失败')
      return Response.error(message)
    }
  }

  /**
   * 新增积分
   * @param {string} taskType - 任务类型
   * @param {Object} info - 积分信息
   * @returns {Promise<Response>}
   */
  async addPoints(taskType, info) {
    try {
      const result = await this.memberService.addPoints(taskType, info)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '积分获取失败')
      return Response.error(message)
    }
  }

  /**
   * 获取积分明细列表
   * @param {number} page - 页码
   * @param {string} openId - 用户openId
   * @returns {Promise<Response>}
   */
  async getPointsDetailList(page, openId) {
    try {
      const result = await this.memberService.getPointsDetailList(page, openId)
      return Response.success({
        list: result.data || [],
        hasMore: result.data && result.data.length >= 20,
        isEmpty: result.data && result.data.length === 0 && page === 1
      })
    } catch (error) {
      const message = this.handleError(error, '获取积分明细失败')
      return Response.error(message)
    }
  }

  /**
   * 申请VIP
   * @param {Object} info - 申请信息
   * @returns {Promise<Response>}
   */
  async applyVip(info) {
    try {
      const result = await this.memberService.applyVip(info)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '申请VIP失败')
      return Response.error(message)
    }
  }

  /**
   * 新增分享明细
   * @param {Object} info - 分享信息
   * @returns {Promise<Response>}
   */
  async addShareDetail(info) {
    try {
      const result = await this.memberService.addShareDetail(info)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '分享记录失败')
      return Response.error(message)
    }
  }

  /**
   * 获取分享明细列表
   * @param {string} openId - 用户openId
   * @param {string} date - 日期
   * @returns {Promise<Response>}
   */
  async getShareDetailList(openId, date) {
    try {
      const result = await this.memberService.getShareDetailList(openId, date)
      return Response.success(result.data || [])
    } catch (error) {
      const message = this.handleError(error, '获取分享明细失败')
      return Response.error(message)
    }
  }
}

module.exports = MemberViewModel

