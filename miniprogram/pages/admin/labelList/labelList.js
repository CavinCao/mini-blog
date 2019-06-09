const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curLabelName: "",
    labelList: [],
    isLabelModelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getLabelList()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    let that = this;
    that.setData({
      labelList: []
    })
    await this.getLabelList()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 获取label集合
   * @param {*} e 
   */
  getLabelList: async function () {
    let that = this
    let labelList = await api.getLabelList()
    console.info(labelList)
    that.setData({
      labelList: labelList.result.data
    })
  },

  /**
    * 显示
    * @param {} e 
  */
  showLabelModal(e) {
    this.setData({
      isLabelModelShow: true
    })
  },
  /**
    * 隐藏
    * @param {*} e 
  */
  hideLabelModal(e) {
    this.setData({
      isLabelModelShow: false
    })
  },
  /**
   * 保存标签
   * @param {*} e 
   */
  formLabelSubmit: async function (e) {
    let that = this;
    let labelName = e.detail.value.labelName;
    if (labelName === undefined || labelName === "") {
      wx.showToast({
        title: '请填写正确的标签',
        icon: 'none',
        duration: 1500
      })
    }
    else {
      wx.showLoading({
        title: '保存中...',
      })

      let res = await api.addBaseLabel(labelName)
      console.info(res)
      wx.hideLoading()
      if (res.result) {
        that.setData({
          isLabelModelShow: false,
          labelName: ""
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

  /**
   * 删除标签
   * @param {*} e 
   */
  deleteLabelById: async function (e) {
    let labelName = e.currentTarget.dataset.labelname
    let labelId = e.currentTarget.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除[' + labelName + ']标签',
      success(res) {
        if (res.confirm) {
          api.deleteConfigById(labelId).then(res => {
            return that.onPullDownRefresh()
          }).then(res => { })
          console.log(res)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})