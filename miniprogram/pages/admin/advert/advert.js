// 【MVVM架构】引入 ViewModel
const AdminViewModel = require('../../../viewmodels/AdminViewModel.js')
const app = getApp();

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
    // 【MVVM架构】初始化 ViewModel
    this.adminViewModel = new AdminViewModel()
    await this.getAdvertConfig()
  },

  getAdvertConfig: async function () {
    try {
      wx.showLoading({
        title: '加载中...',
      })
      
      // 【MVVM架构】使用 AdminViewModel
      const response = await this.adminViewModel.getAdvertConfig()
      
      if (response.success && response.data) {
        this.setData({
          advert: response.data
        })
      } else {
        wx.showToast({
          title: response.message || '加载失败',
          icon: 'none',
          duration: 1500
        })
      }
    } catch (err) {
      console.error('获取广告配置失败:', err)
      wx.showToast({
        title: '加载失败',
        icon: 'none',
        duration: 1500
      })
    } finally {
      wx.hideLoading()
    }
  },

  /**
   * 保存
   * @param {} e 
   */
  formSubmit: async function (e) {
    console.log('form发生了submit事件，提交数据：', e)
    const that = this
    const advert = { ...that.data.advert }
    advert.readMoreStatus = e.detail.value.readMoreStatus
    advert.readMoreId = e.detail.value.readMoreId
    advert.bannerStatus = e.detail.value.bannerStatus
    advert.bannerId = e.detail.value.bannerId
    advert.taskVideoStatus= e.detail.value.taskVideoStatus
    advert.taskVideoId= e.detail.value.taskVideoId
    advert.pointsStatus= e.detail.value.pointsStatus
    advert.pointsId= e.detail.value.pointsId

    try {
      wx.showLoading({
        title: '保存中...',
      })

      // 【MVVM架构】使用 AdminViewModel
      const response = await that.adminViewModel.upsertAdvertConfig(advert)
      wx.hideLoading()
      
      if (response.success) {
        app.globalData.advert = advert
        that.setData({ advert })
        wx.showToast({
          title: "保存成功",
          icon: "success",
          duration: 2000
        });
      } else {
        wx.showToast({
          title: response.message || "保存失败",
          icon: "none",
          duration: 2000
        });
      }
    } catch (error) {
      wx.hideLoading()
      console.error('保存广告配置失败:', error)
      wx.showToast({
        title: "保存失败，请重试",
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