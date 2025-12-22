/**
 * 消息服务接口
 * 所有消息相关的服务实现都必须实现此接口
 */
class IMessageService {
  /**
   * 获取模板列表
   * @returns {Promise<Object>}
   */
  async getTemplateList() {
    throw new Error('Method not implemented: getTemplateList')
  }

  /**
   * 查询订阅消息数量
   * @param {string} templateId - 模板ID
   * @returns {Promise<Object>}
   */
  async querySubscribeCount(templateId) {
    throw new Error('Method not implemented: querySubscribeCount')
  }

  /**
   * 新增订阅消息数量
   * @param {Array<string>} templateIds - 模板ID数组
   * @returns {Promise<Object>}
   */
  async addSubscribeCount(templateIds) {
    throw new Error('Method not implemented: addSubscribeCount')
  }

  /**
   * 新增 FormId
   * @param {Array<string>} formIds - FormId数组
   * @returns {Promise<Object>}
   */
  async addFormIds(formIds) {
    throw new Error('Method not implemented: addFormIds')
  }

  /**
   * 发送模板消息
   * @param {string} nickName - 昵称
   * @param {string} comment - 评论内容
   * @param {string} blogId - 博客ID
   * @returns {Promise<Object>}
   */
  async sendTemplateMessage(nickName, comment, blogId) {
    throw new Error('Method not implemented: sendTemplateMessage')
  }
}

module.exports = IMessageService

