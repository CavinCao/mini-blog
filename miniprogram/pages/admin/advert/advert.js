const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    advert: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getAdvertConfig()
  },

  getAdvertConfig: async function () {
    try {
      wx.showLoading({
        title: '加载中...',
      })
      let result = await api.getAdvertConfig()
      this.setData({
        advert: result.result.value
      })
      console.info(result)
    } catch (err) {
      console.info(err)
    }
    finally {
      wx.hideLoading()
    }
  },

  /**
   * 保存
   * @param {} e 
   */
  formSubmit: async function (e) {
    console.log('form发生了submit事件，提交数据：', e)
    let that = this
    let advert = that.data.advert
    advert.readMoreStatus = e.detail.value.readMoreStatus
    advert.readMoreId = e.detail.value.readMoreId
    advert.bannerStatus = e.detail.value.bannerStatus
    advert.bannerId = e.detail.value.bannerId
    let result = await api.upsertAdvertConfig(advert)
    if (result.result) {
      wx.showToast({
        title: "保存成功",
        icon: "none",
        duration: 2000
      });
    }
    else {
      wx.showToast({
        title: "保存失败",
        icon: "none",
        duration: 2000
      });
    }
  },

  /**
   * 返回上一页
   * @param {*} e 
   */
  goback: async function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

})