const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:"赶快创作你的作品吧...",
    post:{},
    imgList:['http://mmbiz.qpic.cn/mmbiz_jpg/ibT18LpyNmXpSrE29ZnOldmRbPq0wnrMmqe2X1TphuiafHungXqrxFOgoRh5MqvHOxDpCZwYQc3jnIzFWibHw7NMA/0?wx_fmt=jpeg%22']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 初始化富文本框
   */
  onEditorReady:async function() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()

    let result=await api.getPostsById('ee3099285ccee97e0ca03888750d4603')
    console.info(result.data)
    that.editorCtx.setContents({
      html:result.data.content,
      success:  (res)=> {
        console.log(res)
      },
      fail:(res)=> {
        console.log(res)
      }
    })
  },

  showTest:async function(){
    const that = this
    let result=await api.getPostsById('ee3099285ccee97e0ca03888750d4603')
    console.info(result.data)
    that.editorCtx.setContents({
      html:"43243243243",
      success: function () {
        console.log('insert image success')
      }
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

  }
})