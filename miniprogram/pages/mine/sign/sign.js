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
    calendarConfig: {
      multi: true, // 是否开启多选,
      theme: 'default', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
      showLunar: true, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: true, // 单选模式下是否支持取消选中,
      chooseAreaMode: true, // 开启日期范围选择模式，该模式下只可选择时间段
      markToday: '今天', // 当天日期展示不使用默认数字，用特殊文字标记
      defaultDay: false, // 默认选中指定某天；当为 boolean 值 true 时则默认选中当天，非真值则在初始化时不自动选中日期，
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
      preventSwipe: true, // 是否禁用日历滑动切换月份
      disablePastDay: true, // 是否禁选当天之前的日期
      disableLaterDay: true, // 是否禁选当天之后的日期
      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: false, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: true // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
    },
    showBanner: false,
    showBannerId: "",
    signedDays: 0,//连续签到天数
    signed: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    let signedDays = options.signedDays;
    let signed = options.signed;
    let advert = app.globalData.advert
    if (advert.bannerStatus) {
      this.setData({
        showBanner: true,
        showBannerId: advert.bannerId,
        signedDays: signedDays,
        signed: signed == 1
      })
    }

  },
  /**
   * 日历组件渲染之后
   * @param {}} e 
   */
  afterCalendarRender: async function (e) {

    let year=util.getYear(new Date())
    let month=util.getMonth(new Date())
    let res = await api.getSignedDetail(app.globalData.appid, year.toString(), month.toString())
    console.info(res)
    let toSet = [];
    res.result.forEach(function (item) {
      let set = {
        year: item.year,
        month: item.month,
        day: item.day
      }
      toSet.push(set)
      console.info(toSet)
    })

    this.calendar.setSelectedDays(toSet);
  },

  /**
   * 切换月份
   * @param {} e 
   */
  whenChangeMonth: async function (e) {

    console.info(e)
    console.info(e.detail.next.year)
    console.info(e.detail.next.month)
    let res = await api.getSignedDetail(app.globalData.appid, e.detail.next.year.toString(), e.detail.next.month.toString())
    console.info(res)
    let toSet = [];
    res.result.forEach(function (item) {
      let set = {
        year: item.year,
        month: item.month,
        day: item.day
      }
      toSet.push(set)
    })

    this.calendar.setSelectedDays(toSet);
  },

  /**
   * 签到
   * @param {} e 
   */
  bindSignFn: function (e) {

    let that = this
    let tempalteId = 'J-MZ6Zrd08TobUgWPbjQcnJt9BHbc9M-nOOxirC8nWA'
    wx.requestSubscribeMessage({
      tmplIds: [tempalteId],
      success(res) {
        console.info(res)
        that.submitSign(res[tempalteId], tempalteId,that).then((res) => {
          console.info(res)
        })
      },
      fail(res) {
        console.info(res)
        wx.showToast({
          title: '程序有一点点小异常，操作失败啦',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  /**
* 获取订阅消息
*/
  submitSign: async function (accept, templateId,that) {
    try {
      wx.showLoading({
        title: '加载中...',
      })
      let info = {
        openId: app.globalData.openid,
        accept: accept,
        templateId: templateId
      }

      let result = await api.addSign(info)
      await that.afterCalendarRender()
      that.setData({
        signedDays: Number(that.data.signedDays)+1,
        signed: true
      })
      console.info(result)
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500
      })
    }
    catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.info(err)
      wx.hideLoading()
    }
  },
})