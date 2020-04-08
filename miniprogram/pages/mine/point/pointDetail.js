const config = require('../../../utils/config.js')
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointList: [],
    page: 1,
    nodata: false,
    nomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getPointDetailList()
  },

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    let that = this;
    let page = 1
    that.setData({
      page: page,
      pointList: [],
      nomore: false,
      nodata: false
    })
    await this.getPointDetailList()
    wx.stopPullDownRefresh();
  },

    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    await this.getPointDetailList()
  },


  /**
    * 获取积分明细列表
  */
  getPointDetailList: async function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let page = that.data.page
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    let result = await api.getPointsDetailList(page, app.globalData.openid)
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
        pointList: that.data.pointList.concat(result.data),
      })
    }
    wx.hideLoading()
  },
})