const IMessageService = require('../interfaces/IMessageService.js')
const BaseMockService = require('./BaseMockService.js')

/**
 * 消息服务 - Mock 实现
 */
class MockMessageService extends BaseMockService {
  constructor() {
    super()
  }

  async getTemplateList() {
    await this._simulateDelay()
    return this._success([
      { templateId: 'mock_tpl_1', title: '新评论通知' }
    ])
  }

  async querySubscribeCount(templateId) {
    await this._simulateDelay()
    return this._success(5)
  }

  async addSubscribeCount(templateIds) {
    await this._simulateDelay()
    return this._success()
  }

  async addFormIds(formIds) {
    await this._simulateDelay()
    return this._success()
  }

  async sendTemplateMessage(nickName, comment, blogId) {
    await this._simulateDelay()
    console.log(`[Mock] 发送模板消息给 ${nickName}: ${comment}`)
    return this._success()
  }
}

module.exports = MockMessageService

