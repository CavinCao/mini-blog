const Towxml = require('/towxml/main'); 
App({           
  onLaunch: function () {
  
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env:"product-raeub"
      })
      var openid = wx.getStorageSync('openid');
      if (openid) {
        this.globalData.openid = openid
      } else {
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            this.globalData.openid = res.result.openid
            wx.setStorageSync('openid', res.result.openid);
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
      console.info(this.globalData.openid)
    }
  },
  towxml:new Towxml(),
  checkUserInfo: function(cb) {
    let that = this
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo, true);
    } else {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                that.globalData.userInfo = JSON.parse(res.rawData);
                typeof cb == "function" && cb(that.globalData.userInfo, true);
              }
            })
          } else {
            typeof cb == "function" && cb(that.globalData.userInfo, false);
          }
        }
      })
    }
  },
  globalData: {
    openid: "",
    userInfo: null
  }
})
