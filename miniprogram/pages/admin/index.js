const config = require('../../utils/config.js')
const api = require('../../utils/api.js');
const regeneratorRuntime = require('../../utils/runtime.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    formIds: [],
    formIdCount: 0,
    isReleaseShow: false,
    release: { releaseName: '', releaseDate: util.formatTime(new Date()), releaseContent: '' }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    /*let that = this;
    let res = await api.queryFormIds();
    that.setData({
      formIdCount: res.result.formIds
    })*/

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
 * 隐藏
 * @param {*} e 
 */
  hideReleaseModal(e) {
    this.setData({
      isReleaseShow: false
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
 * 显示
 * @param {} e 
 */
  showReleaseModal(e) {
    this.setData({
      isReleaseShow: true
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
   * 保存发布版本
   * @param {*} e 
   */
  formRelaeaseSubmit: async function (e) {
    let that = this;
    let releaseName = e.detail.value.releaseName;
    let releaseDate = e.detail.value.releaseDate;
    let releaseContent = e.detail.value.releaseContent;
    if (releaseName === undefined ||
      releaseName === "" ||
      releaseDate === undefined ||
      releaseDate === "" ||
      releaseContent === undefined ||
      releaseContent === "") {
      wx.showToast({
        title: '请填写正确的表单信息',
        icon: 'none',
        duration: 1500
      })
    }
    else {
      wx.showLoading({
        title: '保存中...',
      })

      let log = {
        releaseName: releaseName,
        releaseDate: releaseDate,
        releaseContent: releaseContent.split("\n")
      }

      let title = '小程序更新啦，赶紧来看看吧'

      let res = await api.addReleaseLog(log, title)
      wx.hideLoading()
      console.info(res)
      if (res.result) {
        that.setData({
          isReleaseShow: false,
          release: { releaseName: '', releaseDate: util.formatTime(new Date()), releaseContent: '' }
        })

        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1500
        })
      }
      else {
        wx.showToast({
          title: '保存出错，请查看云函数日志',
          icon: 'none',
          duration: 1500
        })
      }
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
  },
  /**
   * 跳转文章编辑
   * @param {*} e 
   */
  showArticle: async function (e) {
    wx.navigateTo({
      url: '../admin/articleList/articleList'
    })
  },
  /**
   * 跳转标签列表
   * @param {*} e 
   */
  showLabel: async function (e) {
    wx.navigateTo({
      url: '../admin/labelList/labelList'
    })
  },

  /**
   * 跳转到评论列表
   * @param {*} e 
   */
  showComment: async function (e) {
    wx.navigateTo({
      url: '../admin/comment/comment'
    })
  },

  /**
 * 跳转到专题列表
 * @param {*} e 
 */
  showClassify: async function (e) {
    wx.navigateTo({
      url: '../admin/classify/classify'
    })
  },

  showSubscribe: async function (e) {
    wx.navigateTo({
      url: '../admin/subscribe/subscribe'
    })
  },

  showAdvert:async function (e) {
    wx.navigateTo({
      url: '../admin/advert/advert'
    })
  },
})