/**
 * Mock 服务基类
 */
class BaseMockService {
  constructor() {
    this.delay = 300 // 模拟网络延迟 300ms
  }

  /**
   * 模拟延迟
   * @returns {Promise<void>}
   */
  async _simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, this.delay))
  }

  /**
   * 返回成功的响应格式
   * @param {any} data 
   * @param {string} message 
   */
  _success(data = null, message = '操作成功') {
    return {
      success: true,
      data,
      message,
      code: 0
    }
  }

  /**
   * 返回失败的响应格式
   * @param {string} message 
   * @param {number} code 
   */
  _error(message = '操作失败', code = -1) {
    return {
      success: false,
      data: null,
      message,
      code
    }
  }
}

module.exports = BaseMockService

