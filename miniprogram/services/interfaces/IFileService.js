/**
 * 文件服务接口
 * 所有文件相关的服务实现都必须实现此接口
 */
class IFileService {
  /**
   * 上传文件
   * @param {string} cloudPath - 云端路径
   * @param {string} filePath - 本地文件路径
   * @returns {Promise<Object>}
   */
  async uploadFile(cloudPath, filePath) {
    throw new Error('Method not implemented: uploadFile')
  }

  /**
   * 获取临时URL
   * @param {string} fileID - 文件ID
   * @returns {Promise<Object>}
   */
  async getTempUrl(fileID) {
    throw new Error('Method not implemented: getTempUrl')
  }
}

module.exports = IFileService

