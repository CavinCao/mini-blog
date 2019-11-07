const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    templates: [{ "priTmplId": "BxVtrR681icGxgVJOfJ8xdze6TsZiXdSmmUUXnd_9Zg", "title": "留言通知" }],
    isShow: false,
    templateIds: [],
    curTemPlatedId: "",
    curTitle:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that=this
    let templates=that.data.templates
    for (var index in that.data.templates) {
      var res=await api.querySubscribeCount(templates[index].priTmplId);
      console.info(res)
      templates[index].sendCount=res.result.formIds
    }

    console.info(templates)

    that.setData({
      templates: templates
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
 * 显示
 * @param {} e 
 */
  showModol(e) {
    this.setData({
      isShow: true,
      curTemPlatedId: e.currentTarget.dataset.templatedid,
      curTitle:e.currentTarget.dataset.title
    })
  },
  /**
 * 隐藏
 * @param {*} e 
 */
  hideModal(e) {
    this.setData({
      isShow: false,
      curTemPlatedId: "",
      curTitle:""
    })
  },

  /**
 * 生成formId
 * @param {*} e 
 */
  templateGen: function (e) {
    let that = this;
    if (that.data.templateIds.length > 10) {
      wx.showToast({
        title: '超过生成上限啦',
        icon: 'none',
        image: '',
        duration: 1500
      });
      return;
    }

    wx.requestSubscribeMessage({
      tmplIds: [that.data.curTemPlatedId],
      success(res) {
        that.setData({
          templateIds: that.data.templateIds.concat(that.data.curTemPlatedId),
        })
      },
      fail(res) {
        console.info(res)
        wx.showToast({
          title: '小程序不再让生成啦',
          icon: 'none',
          image: '',
          duration: 1500
        });
      }
    })
  },

  /**
   * 保存
   * @param {*} e 
   */
  saveTemplateIds:async function(e){

    let that = this;
    if (that.data.templateIds.length === 0) {
      return;
    }

    wx.showLoading({
      title: '保存中...',
    })
    let res = await api.addSubscribeCount(that.data.templateIds)
    console.info(res)
    if (res.result) {
      that.setData({
        templateIds: [],
        isShow: false
      })

      wx.showToast({
        title: '保存完成',
        icon: 'none',
        duration: 1500
      })
    }
    else {
      wx.showToast({
        title: '保存出现异常',
        icon: 'none',
        duration: 1500
      })
    }
    wx.hideLoading()
  }
})