const AdminViewModel = require('../../viewmodels/AdminViewModel.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function(options) {
    // 【MVVM架构】初始化 ViewModel
    this.adminViewModel = new AdminViewModel();
    
    await this.getClassifyList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function() {
    let that = this;
    that.setData({
      classifyList: []
    })
    await this.getClassifyList()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

    /**
   * 获取专题集合
   * @param {*} e 
   */
  getClassifyList: async function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    
    // 【MVVM架构】使用 AdminViewModel
    const response = await this.adminViewModel.getClassifyList()
    console.info(response)
    
    if (response.success) {
      that.setData({
        classifyList: response.data
      })
    } else {
      wx.showToast({
        title: response.message || '加载失败',
        icon: 'none'
      })
    }
    
    wx.hideLoading()
  },

  /**
   * 跳转至专题详情
   * @param {} e 
   */
  openTopicPosts:async function(e){
    let classify = e.currentTarget.dataset.tname;
    wx.navigateTo({
      url: '../topic/topiclist/topiclist?classify=' + classify
    })
  }
})