const config = require('../../utils/config.js')
const api = require('../../utils/api.js');
const regeneratorRuntime = require('../../utils/runtime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    formIds: [],
    formIdCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
    let res = await api.queryFormIds();
    that.setData({
      formIdCount: res.result.formIds
    })

  },
  /**
   * 隐藏
   * @param {*} e 
   */
  hideFormModal(e) {
    this.setData({
      isShow: false
    })
  },
  /**
   * 显示
   * @param {} e 
   */
  showFormModal(e) {
    this.setData({
      isShow: true
    })
  },
  /**
   * 生成formId
   * @param {*} e 
   */
  formSubmit: function (e) {
    let that = this;
    console.info(e.detail.formId)
    if (that.data.formIds.length > 10) {
      wx.showToast({
        title: '超过生成上限啦',
        icon: 'none',
        image: '',
        duration: 1500
      });
      return;
    }
    if (e.detail != undefined && e.detail.formId != undefined && e.detail.formId != "the formId is a mock one") {
      that.setData({
        formIds: that.data.formIds.concat(e.detail.formId),
      })
      console.info(that.data.formIds)
    }
  },
  /**
   * 批量保存formIds
   * @param {} e 
   */
  saveFormIds: async function (e) {

    let that = this;
    if (that.data.formIds.length === 0) {
      return;
    }

    wx.showLoading({
      title: '保存中...',
    })
    let res = await api.addFormIds(that.data.formIds)
    console.info(res)
    if (res.result) {
      that.setData({
        formIds: [],
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