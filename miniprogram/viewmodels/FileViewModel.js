const BaseViewModel = require('./base/BaseViewModel.js')
const Response = require('./base/Response.js')
const ServiceFactory = require('../services/ServiceFactory.js')

/**
 * 文件 ViewModel
 * 封装文件相关的业务逻辑
 */
class FileViewModel extends BaseViewModel {
  constructor() {
    super()
    this.fileService = ServiceFactory.getFileService()
  }

  /**
   * 上传文件
   * @param {string} cloudPath - 云端路径
   * @param {string} filePath - 本地文件路径
   * @returns {Promise<Response>}
   */
  async uploadFile(cloudPath, filePath) {
    try {
      const result = await this.fileService.uploadFile(cloudPath, filePath)
      return Response.success(result)
    } catch (error) {
      const message = this.handleError(error, '上传文件失败')
      return Response.error(message)
    }
  }

  /**
   * 获取临时URL
   * @param {string} fileID - 文件ID
   * @returns {Promise<Response>}
   */
  async getTempUrl(fileID) {
    try {
      const result = await this.fileService.getTempUrl(fileID)
      return Response.success(result)
    } catch (error) {
      const message = this.handleError(error, '获取文件URL失败')
      return Response.error(message)
    }
  }
}

module.exports = FileViewModel

