const regeneratorRuntime = require('../../../utils/runtime.js');
const api = require('../../../utils/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice: [],
    page: 1,
    nodata: false,
    nomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.setStorageSync('showRedDot', '1');
    await this.getNoticeLogsList()
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
    await this.getNoticeLogsList()
  },

  /**
   * 消息详情
   */
  bindDetail: function (e) {
    let path = e.currentTarget.dataset.path;
    console.info(path)
    wx.navigateTo({
      url: path
    })
  },
  /**
    * 获取消息列表
  */
  getNoticeLogsList: async function (filter) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let page = that.data.page
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    let result = await api.getNoticeLogsList(page, '')
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
        notice: that.data.notice.concat(result.data),
      })
    }
    wx.hideLoading()
  }

})