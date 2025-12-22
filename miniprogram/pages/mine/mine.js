const config = require('../../utils/config.js')
const util = require('../../utils/util.js')
const AdminViewModel = require('../../viewmodels/AdminViewModel.js')
const MemberViewModel = require('../../viewmodels/MemberViewModel.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showLogin: false,
    isAuthor: false,
    isVip: false,
    vipDesc: '点击申请VIP',
    showRedDot: '',
    signedDays: 0,//连续签到天数
    signed: 0,
    signedRightCount: 0,
    applyStatus: 0,
    showVIPModal: false,
    signBtnTxt: "每日签到",
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', // 默认头像
    nickName: '', // 用户昵称
    iconList: [{
      icon: 'favorfill',
      color: 'grey',
      badge: 0,
      name: '我的收藏',
      bindtap: "bindCollect"
    }, {
      icon: 'appreciatefill',
      color: 'green',
      badge: 0,
      name: '我的点赞',
      bindtap: "bindZan"
    }, {
      icon: 'noticefill',
      color: 'yellow',
      badge: 0,
      name: '我的消息',
      bindtap: "bindNotice"
    }, {
      icon: 'goodsfavor',
      color: 'orange',
      badge: 0,
      name: '我的积分',
      bindtap: "bindPoint"
    }],
  },

  onShow: async function () {
    await this.getMemberInfo()
    await this.loadUserProfile()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 初始化 ViewModel
    this.adminViewModel = new AdminViewModel()
    this.memberViewModel = new MemberViewModel()
    
    let that = this;
    let showRedDot = wx.getStorageSync('showRedDot');
    console.info(showRedDot)

    console.info(showRedDot != '1')
    that.setData({
      showRedDot: showRedDot
    });
    await that.checkAuthor()
    await that.loadUserProfile()
    //await that.getMemberInfo()
  },

  /**
   * 加载用户头像和昵称
   */
  loadUserProfile: async function() {
    let that = this
    try {
      // 从本地存储或云端加载用户头像和昵称
      const userProfile = wx.getStorageSync('userProfile')
      if (userProfile) {
        that.setData({
          avatarUrl: userProfile.avatarUrl || that.data.avatarUrl,
          nickName: userProfile.nickName || ''
        })
      }
    } catch (e) {
      console.error('加载用户信息失败', e)
    }
  },

  /**
   * 选择头像回调
   */
  onChooseAvatar: function(e) {
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl
    })
    // 保存到本地
    this.saveUserProfile()
  },

  /**
   * 昵称输入回调
   */
  onNicknameInput: function(e) {
    this.setData({
      nickName: e.detail.value
    })
    // 保存到本地
    this.saveUserProfile()
  },

  /**
   * 保存用户头像和昵称到本地
   */
  saveUserProfile: function() {
    const userProfile = {
      avatarUrl: this.data.avatarUrl,
      nickName: this.data.nickName
    }
    wx.setStorageSync('userProfile', userProfile)
  },
  /**
   * 返回
   */
  navigateBack: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

  /**
   * 获取用户头像
   * @param {} e 
   */
  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        showLogin: !this.data.showLogin,
        userInfo: e.detail.userInfo
      });
    } else {
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  /**
   * 展示打赏二维码
   * @param {} e 
   */
  showQrcode: async function (e) {
    wx.previewImage({
      urls: [config.moneyUrl],
      current: config.moneyUrl
    })
  },
  /**
   * 展示微信二维码
   * @param {*} e 
   */
  showWechatCode: async function (e) {
    wx.previewImage({
      urls: ["../../images/wechat.jpg"],
      current: "../../images/wechat.jpg"
    })
  },
  /**
   * 跳转我的收藏
   * @param {*} e 
   */
  bindCollect: async function (e) {
    wx.navigateTo({
      url: '../mine/collection/collection?type=1'
    })
  },
  /**
   * 跳转我的点赞 
   * @param {*} e 
   */
  bindZan: async function (e) {
    wx.navigateTo({
      url: '../mine/collection/collection?type=2'
    })
  },

  /**
   * 后台设置
   * @param {} e 
   */
  showAdmin: async function (e) {
    wx.navigateTo({
      url: '../admin/index'
    })
  },

  /**
   * 历史版本
   * @param {} e 
   */
  showRelease: async function (e) {
    wx.navigateTo({
      url: '../mine/release/release'
    })
  },

  /**
   * 我的消息
   * @param {*} e 
   */
  bindNotice: async function (e) {
    wx.navigateTo({
      url: '../mine/notice/notice'
    })
  },

  /**
   * 签到列表
   * @param {*} e 
   */
  btnSigned: async function (e) {
    wx.navigateTo({
      url: '../mine/sign/sign?signedDays=' + this.data.signedDays + '&signed=' + this.data.signed + '&signedRightCount=' + this.data.signedRightCount
    })
  },

  /**
   * 我的积分
   * @param {} e 
   */
  bindPoint: async function (e) {
    wx.navigateTo({
      url: '../mine/point/point'
    })
  },

  /**
   * 验证是否是管理员
   */
  checkAuthor: async function (e) {
    let that = this;
    const value = wx.getStorageSync('isAuthor')
    if (value) {
      console.info(value)
      that.setData({
        isAuthor: value
      })
    }
    else {
      // 【MVVM架构】使用 AdminViewModel
      const response = await this.adminViewModel.checkAuthor();
      console.info(response)
      if (response.success && response.data) {
        wx.setStorageSync('isAuthor', response.data)
        that.setData({
          isAuthor: response.data
        })
      }
    }
  },

  /**
* 展示打赏二维码
* @param {} e 
*/
  showMoneryUrl: async function (e) {
    wx.previewImage({
      urls: [config.moneyUrl],
      current: config.moneyUrl
    })
  },

  /**
   * VIP申请
   * @param {*} e 
   */
  clickVip: async function (e) {
    let that = this
    if (that.data.isVip) {
      return;
    }

    app.checkUserInfo(function (userInfo, isLogin) {
      if (!isLogin) {
        that.setData({
          showLogin: true
        })
      } else {
        that.setData({
          userInfo: userInfo
        });
      }
    });

    console.info(that.data.applyStatus)
    if (that.data.applyStatus == 1) {
      wx.showToast({
        title: "已经申请，等待审核",
        icon: "none",
        duration: 3000
      });
      return;
    }

    that.setData({
      showVIPModal: true
    })
  },

  /**
* 返回
*/
  navigateBack: function (e) {
    let that = this
    that.setData({
      showLogin: false
    })
  },

  /**
   * 隐藏
   * @param {}} e 
   */
  hideModal: async function (e) {
    this.setData({
      showVIPModal: false
    })
  },

  /**
* 正式提交
*/
  submitApplyVip: async function (accept, templateId, that) {
    try {
      // 检查是否填写了昵称
      if (!that.data.nickName || that.data.nickName.trim() === '') {
        wx.showToast({
          title: "请先填写昵称",
          icon: "none",
          duration: 2000
        });
        return;
      }

      wx.showLoading({
        title: '提交中...',
      })

      // 如果选择了新头像，需要先上传到云存储
      let finalAvatarUrl = that.data.avatarUrl
      if (that.data.avatarUrl.indexOf('tmp') !== -1) {
        // 临时文件，需要上传到云存储
        const cloudPath = `avatars/${app.globalData.openid}_${Date.now()}.png`
        try {
          const uploadResult = await wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: that.data.avatarUrl
          })
          finalAvatarUrl = uploadResult.fileID
          console.info('头像上传成功', finalAvatarUrl)
        } catch (uploadErr) {
          console.error('头像上传失败', uploadErr)
          wx.showToast({
            title: "头像上传失败",
            icon: "none",
            duration: 2000
          });
          wx.hideLoading()
          return;
        }
      }

      console.info('提交的用户信息:', {
        nickName: that.data.nickName,
        avatarUrl: finalAvatarUrl
      })

      let info = {
        nickName: that.data.nickName,
        avatarUrl: finalAvatarUrl,
        accept: accept,
        templateId: templateId
      }
      // 【MVVM架构】使用 MemberViewModel
      const response = await this.memberViewModel.applyVip(info)
      console.info(response)
      if (response.success) {
        // 更新本地存储
        that.saveUserProfile()
        
        wx.showToast({
          title: "申请成功，等待审批",
          icon: "none",
          duration: 3000
        });
        that.setData({
          showVIPModal: false,
          applyStatus: 1
        })
      }
      else {
        wx.showToast({
          title: response.message || "程序出错啦",
          icon: "none",
          duration: 3000
        });
      }

      wx.hideLoading()
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


  /**
   * 申请VIP
   * @param {*} e 
   */
  applyVip: async function (e) {
    let that = this
    let tempalteId = 'DI_AuJDmFXnNuME1vpX_hY2yw1pR6kFXPZ7ZAQ0uLOY'
    wx.requestSubscribeMessage({
      tmplIds: [tempalteId],
      success(res) {
        console.info(res)
        that.submitApplyVip(res[tempalteId], tempalteId, that).then((res) => {
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
   * 获取用户信息
   * @param {} e 
   */
  getMemberInfo: async function (e) {
    let that = this
    try {
      // 【MVVM架构】使用 MemberViewModel
      const response = await this.memberViewModel.getMemberInfo(app.globalData.openid)
      console.info(response)
      if (response.success && response.data) {
        let memberInfo = response.data
        that.setData({
          signedDays: memberInfo.continueSignedCount || 0,
          signed: util.formatTime(new Date()) == memberInfo.lastSignedDate ? 1 : 0,
          signBtnTxt: util.formatTime(new Date()) == memberInfo.lastSignedDate ? "今日已签到" : "每日签到",
          vipDesc: Number(memberInfo.level) > 1 ? "VIP用户" : "点击申请VIP",
          isVip: Number(memberInfo.level) > 1,
          applyStatus: memberInfo.applyStatus || 0,
          signedRightCount: memberInfo.sighRightCount == undefined ? 0 : memberInfo.sighRightCount
        })
      }
    }
    catch (e) {
      console.info(e)
    }
  },
  hideModal(e) {
    this.setData({
      showVIPModal: false
    })
  },
})

