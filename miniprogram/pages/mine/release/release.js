const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logs: [],
    page: 1,
    nodata: false,
    nomore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getReleaseLogs()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    await this.getReleaseLogs()
  },

  /**
   * 获取版本发布日志
   */
  getReleaseLogs: async function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let page = that.data.page
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    let result = await api.getReleaseLogsList(page)
    console.info(result)
    if (result.data.length === 0) {
      that.setData({
        nomore: true
      })
      if (page === 1) {
        that.setData({
          nodata: true
        })
      }
    }
    else {
      that.setData({
        page: page + 1,
        logs: that.data.logs.concat(result.data),
      })
    }
    wx.hideLoading()
  }
})