const config = require('../utils/config.js')

// Cloud Service 实现
const CloudPostService = require('./cloud/CloudPostService.js')
const CloudCommentService = require('./cloud/CloudCommentService.js')
const CloudMemberService = require('./cloud/CloudMemberService.js')
const CloudAdminService = require('./cloud/CloudAdminService.js')
const CloudMessageService = require('./cloud/CloudMessageService.js')
const CloudGitHubService = require('./cloud/CloudGitHubService.js')
const CloudFileService = require('./cloud/CloudFileService.js')

// Mock Service 实现
const MockPostService = require('./mock/MockPostService.js')
const MockCommentService = require('./mock/MockCommentService.js')
const MockMemberService = require('./mock/MockMemberService.js')
const MockAdminService = require('./mock/MockAdminService.js')
const MockMessageService = require('./mock/MockMessageService.js')
const MockGitHubService = require('./mock/MockGitHubService.js')
const MockFileService = require('./mock/MockFileService.js')

// HTTP Service 实现 (预留)
// ...

/**
 * 服务工厂类
 * 根据配置返回对应的服务实现
 */
class ServiceFactory {
  /**
   * 获取文章服务
   * @returns {IPostService}
   */
  static getPostService() {
    if (config.serviceType === 'cloud') {
      return new CloudPostService()
    } else if (config.serviceType === 'mock') {
      return new MockPostService()
    } else if (config.serviceType === 'http') {
      // return new HttpPostService()
      throw new Error('HTTP Service 尚未实现')
    }
    throw new Error('未知的服务类型: ' + config.serviceType)
  }

  /**
   * 获取评论服务
   * @returns {ICommentService}
   */
  static getCommentService() {
    if (config.serviceType === 'cloud') {
      return new CloudCommentService()
    } else if (config.serviceType === 'mock') {
      return new MockCommentService()
    } else if (config.serviceType === 'http') {
      // return new HttpCommentService()
      throw new Error('HTTP Service 尚未实现')
    }
    throw new Error('未知的服务类型: ' + config.serviceType)
  }

  /**
   * 获取会员服务
   * @returns {IMemberService}
   */
  static getMemberService() {
    if (config.serviceType === 'cloud') {
      return new CloudMemberService()
    } else if (config.serviceType === 'mock') {
      return new MockMemberService()
    } else if (config.serviceType === 'http') {
      // return new HttpMemberService()
      throw new Error('HTTP Service 尚未实现')
    }
    throw new Error('未知的服务类型: ' + config.serviceType)
  }

  /**
   * 获取管理员服务
   * @returns {IAdminService}
   */
  static getAdminService() {
    if (config.serviceType === 'cloud') {
      return new CloudAdminService()
    } else if (config.serviceType === 'mock') {
      return new MockAdminService()
    } else if (config.serviceType === 'http') {
      // return new HttpAdminService()
      throw new Error('HTTP Service 尚未实现')
    }
    throw new Error('未知的服务类型: ' + config.serviceType)
  }

  /**
   * 获取消息服务
   * @returns {IMessageService}
   */
  static getMessageService() {
    if (config.serviceType === 'cloud') {
      return new CloudMessageService()
    } else if (config.serviceType === 'mock') {
      return new MockMessageService()
    } else if (config.serviceType === 'http') {
      // return new HttpMessageService()
      throw new Error('HTTP Service 尚未实现')
    }
    throw new Error('未知的服务类型: ' + config.serviceType)
  }

  /**
   * 获取 GitHub 服务
   * @returns {IGitHubService}
   */
  static getGitHubService() {
    if (config.serviceType === 'cloud') {
      return new CloudGitHubService()
    } else if (config.serviceType === 'mock') {
      return new MockGitHubService()
    } else if (config.serviceType === 'http') {
      // return new HttpGitHubService()
      throw new Error('HTTP Service 尚未实现')
    }
    throw new Error('未知的服务类型: ' + config.serviceType)
  }

  /**
   * 获取文件服务
   * @returns {IFileService}
   */
  static getFileService() {
    if (config.serviceType === 'cloud') {
      return new CloudFileService()
    } else if (config.serviceType === 'mock') {
      return new MockFileService()
    } else if (config.serviceType === 'http') {
      // return new HttpFileService()
      throw new Error('HTTP Service 尚未实现')
    }
    throw new Error('未知的服务类型: ' + config.serviceType)
  }
}

module.exports = ServiceFactory

