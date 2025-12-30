const IAdminService = require('../interfaces/IAdminService.js')
const BaseMockService = require('./BaseMockService.js')
const Label = require('../../models/Label.js')
const Classify = require('../../models/Classify.js')

/**
 * 管理员服务 - Mock 实现
 */
class MockAdminService extends BaseMockService {
  constructor() {
    super()
    this.labels = [
      { _id: 'l1', name: 'JavaScript' },
      { _id: 'l2', name: '小程序' },
      { _id: 'l3', name: 'Vue' }
    ]
    this.classifies = [
      { _id: 'c1', name: '技术', desc: '技术分享' },
      { _id: 'c2', name: '生活', desc: '生活点滴' }
    ]
    this.releaseLogs = [
      { _id: 'log1', title: 'v1.0.0 发布', log: '项目初始化完成', createTime: Date.now() }
    ]
    this.advertConfig = {
      _id: 'advert_1',
      value: {
        show: true,
        unitId: 'mock_unit_id'
      }
    }
    this.activityConfig = [
      {
        _id: 'activity_1',
        show: true,
        title: 'Mock 架构升级计划',
        image_url: 'https://picsum.photos/600/200?random=101',
        jump_url: '/pages/topic/topic'
      },
      {
        _id: 'activity_2',
        show: true,
        title: '助力开源，共建社区',
        image_url: 'https://picsum.photos/600/200?random=102',
        jump_url: '/pages/git/git'
      }
    ]
  }

  async checkAuthor() {
    await this._simulateDelay()
    return this._success(true)
  }

  async addReleaseLog(log, title) {
    await this._simulateDelay()
    this.releaseLogs.unshift({ _id: 'log_' + Date.now(), log, title, createTime: Date.now() })
    return this._success()
  }

  async getReleaseLogsList(page) {
    await this._simulateDelay()
    return this.releaseLogs.slice((page - 1) * 10, page * 10)
  }

  async getNoticeLogsList(page, openId) {
    await this._simulateDelay()
    return []
  }

  async getLabelList() {
    await this._simulateDelay()
    return this.labels.map(l => new Label({ id: l._id, ...l }))
  }

  async addBaseLabel(labelName) {
    await this._simulateDelay()
    const newLabel = { _id: 'l_' + Date.now(), labelName }
    this.labels.push(newLabel)
    return this._success(newLabel)
  }

  async getClassifyList() {
    await this._simulateDelay()
    return this.classifies.map(c => new Classify({ id: c._id, ...c }))
  }

  async addBaseClassify(classifyName, classifyDesc) {
    await this._simulateDelay()
    const newClassify = { _id: 'c_' + Date.now(), classifyName, classifyDesc }
    this.classifies.push(newClassify)
    return this._success(newClassify)
  }

  async deleteConfigById(id) {
    await this._simulateDelay()
    return this._success()
  }

  async approveApplyVip(id, apply, openId) {
    await this._simulateDelay()
    return this._success()
  }

  async getAdvertConfig() {
    await this._simulateDelay()
    return this._success(this.advertConfig)
  }

  async upsertAdvertConfig(advert) {
    await this._simulateDelay()
    this.advertConfig.value = advert
    return this._success()
  }

  async upsertPosts(id, data) {
    await this._simulateDelay()
    return this._success()
  }

  async updatePostsShowStatus(id, isShow) {
    await this._simulateDelay()
    return this._success()
  }

  async deletePostById(id) {
    await this._simulateDelay()
    return this._success()
  }

  async getActivityConfig() {
    await this._simulateDelay()
    return this._success(this.activityConfig)
  }

  async saveActivityConfig(config) {
    await this._simulateDelay()
    this.activityConfig = { ...this.activityConfig, ...config }
    return this._success()
  }
}

module.exports = MockAdminService

