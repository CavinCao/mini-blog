const IFileService = require('../interfaces/IFileService.js')
const BaseMockService = require('./BaseMockService.js')

/**
 * 文件服务 - Mock 实现
 */
class MockFileService extends BaseMockService {
  constructor() {
    super()
  }

  async uploadFile(cloudPath, filePath) {
    await this._simulateDelay()
    return this._success({
      fileID: 'mock_file_id_' + Date.now()
    })
  }

  async getTempUrl(fileID) {
    await this._simulateDelay()
    return this._success({
      fileList: [{
        tempFileURL: 'https://via.placeholder.com/150?text=Mock+File'
      }]
    })
  }
}

module.exports = MockFileService

