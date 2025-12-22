/**
 * 分类/专题数据模型
 * 纯粹的数据结构定义，不绑定特定数据源
 * 数据转换逻辑由各个 Service 实现负责
 */
class Classify {
  constructor(data = {}) {
    this.id = data.id || ''
    this.name = data.name || ''
    this.desc = data.desc || ''
    this.createTime = data.createTime || 0
  }

  /**
   * 转换为简化格式
   * @returns {Object}
   */
  toSimple() {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc
    }
  }
}

module.exports = Classify
