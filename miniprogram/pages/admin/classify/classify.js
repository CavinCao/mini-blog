const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyList: [],
    classifyName: "",
    classifyDesc: "",
    isClassifyModelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getClassifyList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:async function () {
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
  onReachBottom: function () {

  },
  /**
   * 获取专题集合
   * @param {*} e 
   */
  getClassifyList: async function () {
    let that = this
    let classifyList = await api.getClassifyList()
    console.info(classifyList)
    that.setData({
      classifyList: classifyList.result.data
    })
  },
  /**
    * 显示
    * @param {} e 
  */
  showClassifyModal(e) {
    this.setData({
      isClassifyModelShow: true
    })
  },
  /**
    * 隐藏
    * @param {*} e 
  */
  hideClassifyModal(e) {
    this.setData({
      isClassifyModelShow: false
    })
  },
  /**
   * 保存标签
   * @param {*} e 
   */
  formClassifySubmit: async function (e) {
    let that = this;
    let classifyName = e.detail.value.classifyName;
    let classifyDesc=e.detail.value.classifyDesc;
    if (classifyName === undefined || classifyName === "") {
      wx.showToast({
        title: '请填写正确的专题',
        icon: 'none',
        duration: 1500
      })
    }
    else {
      wx.showLoading({
        title: '保存中...',
      })

      let res = await api.addBaseClassify(classifyName,classifyDesc)
      console.info(res)
      wx.hideLoading()
      if (res.result) {
        that.setData({
          isClassifyModelShow: false,
          classifyName: "",
          classifyDesc:""
        })

        that.onPullDownRefresh()

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
})