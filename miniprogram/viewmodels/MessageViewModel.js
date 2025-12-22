const BaseViewModel = require('./base/BaseViewModel.js')
const Response = require('./base/Response.js')
const ServiceFactory = require('../services/ServiceFactory.js')

/**
 * 消息 ViewModel
 * 封装消息相关的业务逻辑
 */
class MessageViewModel extends BaseViewModel {
  constructor() {
    super()
    this.messageService = ServiceFactory.getMessageService()
  }

  /**
   * 获取模板列表
   * @returns {Promise<Response>}
   */
  async getTemplateList() {
    try {
      const result = await this.messageService.getTemplateList()
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '获取模板列表失败')
      return Response.error(message)
    }
  }

  /**
   * 查询订阅消息数量
   * @param {string} templateId - 模板ID
   * @returns {Promise<Response>}
   */
  async querySubscribeCount(templateId) {
    try {
      const result = await this.messageService.querySubscribeCount(templateId)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '查询订阅数量失败')
      return Response.error(message)
    }
  }

  /**
   * 新增订阅消息数量
   * @param {Array<string>} templateIds - 模板ID数组
   * @returns {Promise<Response>}
   */
  async addSubscribeCount(templateIds) {
    try {
      const result = await this.messageService.addSubscribeCount(templateIds)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '订阅失败')
      return Response.error(message)
    }
  }

  /**
   * 新增 FormId
   * @param {Array<string>} formIds - FormId数组
   * @returns {Promise<Response>}
   */
  async addFormIds(formIds) {
    try {
      const result = await this.messageService.addFormIds(formIds)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '新增FormId失败')
      return Response.error(message)
    }
  }

  /**
   * 发送模板消息
   * @param {string} nickName - 昵称
   * @param {string} comment - 评论内容
   * @param {string} blogId - 博客ID
   * @returns {Promise<Response>}
   */
  async sendTemplateMessage(nickName, comment, blogId) {
    try {
      const result = await this.messageService.sendTemplateMessage(nickName, comment, blogId)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '发送消息失败')
      return Response.error(message)
    }
  }
}

module.exports = MessageViewModel

