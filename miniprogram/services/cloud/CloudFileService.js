const IFileService = require('../interfaces/IFileService.js')

/**
 * 文件服务 - 云开发实现
 */
class CloudFileService extends IFileService {
  constructor() {
    super()
  }

  /**
   * 上传文件
   */
  async uploadFile(cloudPath, filePath) {
    return await wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath
    })
  }

  /**
   * 获取临时URL
   */
  async getTempUrl(fileID) {
    return await wx.cloud.getTempFileURL({
      fileList: [{
        fileID: fileID
      }]
    })
  }
}

module.exports = CloudFileService

