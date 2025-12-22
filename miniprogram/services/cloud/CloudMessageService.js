const IMessageService = require('../interfaces/IMessageService.js')
const BaseCloudService = require('./BaseCloudService.js')

/**
 * 消息服务 - 云开发实现
 */
class CloudMessageService extends BaseCloudService {
  constructor() {
    super()
  }

  /**
   * 获取模板列表
   */
  async getTemplateList() {
    return await wx.cloud.callFunction({
      name: 'messageService',
      data: {
        action: "getTemplateList"
      }
    })
  }

  /**
   * 查询订阅消息数量
   */
  async querySubscribeCount(templateId) {
    return await wx.cloud.callFunction({
      name: 'messageService',
      data: {
        action: "querySubscribeCount",
        templateId: templateId
      }
    })
  }

  /**
   * 新增订阅消息数量
   */
  async addSubscribeCount(templateIds) {
    return await wx.cloud.callFunction({
      name: 'messageService',
      data: {
        action: "addSubscribeCount",
        templateIds: templateIds
      }
    })
  }

  /**
   * 新增 FormId
   */
  async addFormIds(formIds) {
    return await wx.cloud.callFunction({
      name: 'messageService',
      data: {
        action: "addFormIds",
        formIds: formIds
      }
    })
  }

  /**
   * 发送模板消息
   */
  async sendTemplateMessage(nickName, comment, blogId) {
    return await wx.cloud.callFunction({
      name: 'messageService',
      data: {
        action: "sendTemplateMessage",
        nickName: nickName,
        message: comment,
        blogId: blogId,
        tOpenId: ""
      }
    })
  }
}

module.exports = CloudMessageService

