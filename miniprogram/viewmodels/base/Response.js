/**
 * 统一响应格式
 * 用于封装所有 ViewModel 的返回结果
 * 
 * 注意：本类只提供通用的响应封装，不绑定特定数据源
 * 云开发相关的结果解析逻辑已下沉到 BaseCloudService
 */
class Response {
  /**
   * 构造函数
   * @param {boolean} success - 是否成功
   * @param {*} data - 返回数据
   * @param {string} message - 提示信息
   * @param {number} code - 业务状态码
   */
  constructor(success, data = null, message = '', code = 0) {
    this.success = success
    this.data = data
    this.message = message
    this.code = code
  }

  /**
   * 创建成功响应
   * @param {*} data - 返回数据
   * @param {string} message - 提示信息
   * @returns {Response}
   */
  static success(data, message = '操作成功') {
    return new Response(true, data, message, 0)
  }

  /**
   * 创建失败响应
   * @param {string} message - 错误信息
   * @param {number} code - 错误码
   * @returns {Response}
   */
  static error(message = '操作失败', code = -1) {
    return new Response(false, null, message, code)
  }
}

module.exports = Response
