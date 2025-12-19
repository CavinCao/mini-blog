const config = require('../../utils/config.js')
const api = require('../../utils/api.js');
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
    isSyncShow: false,
    isSyncing: false,
    isManualSyncShow: false,
    isManualSyncing: false,
    manualSync: { articleUrl: '', defaultImageUrl: '', tempFilePath: '' },
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
  showMember:async function (e) {
    wx.navigateTo({
      url: '../admin/member/member'
    })
  },

  /**
   * 显示同步确认弹窗
   */
  showSyncModal: function(e) {
    // 检查是否在冷却期内
    const lastSyncTime = wx.getStorageSync('lastSyncTime') || 0
    const currentTime = Date.now()
    const thirtyMinutes = 30 * 60 * 1000 // 30分钟的毫秒数

    if (currentTime - lastSyncTime < thirtyMinutes) {
      const remainingTime = thirtyMinutes - (currentTime - lastSyncTime)
      const remainingMinutes = Math.ceil(remainingTime / 60000)
      
      wx.showModal({
        title: '同步限制',
        content: `后台正在执行同步任务，请${remainingMinutes}分钟后再试`,
        showCancel: false,
        confirmText: '知道了'
      })
      return
    }

    this.setData({
      isSyncShow: true
    })
  },

  /**
   * 隐藏同步确认弹窗
   */
  hideSyncModal: function(e) {
    this.setData({
      isSyncShow: false,
      isSyncing: false
    })
  },

  /**
   * 确认同步公众号文章
   */
  confirmSync: async function(e) {
    const that = this
    
    if (that.data.isSyncing) {
      return // 防止重复点击
    }

    try {
      that.setData({
        isSyncing: true
      })

      console.info('开始异步同步公众号文章...')
      
      // 异步调用云函数，不等待响应
      api.syncWechatPosts().then(res => {
        console.info('✅ 同步云函数调用成功:', res)
      }).catch(error => {
        console.error('❌ 同步云函数调用失败:', error)
      })
      
      // 记录同步时间戳
      const currentTime = Date.now()
      wx.setStorageSync('lastSyncTime', currentTime)
      
      console.info('📝 已记录同步时间戳:', new Date(currentTime).toLocaleString())
      
      // 立即显示友好提示
      wx.showToast({
        title: '后台同步中，请稍后查看',
        icon: 'success',
        duration: 2500
      })
      
      // 自动关闭弹窗
      setTimeout(() => {
        that.setData({
          isSyncShow: false,
          isSyncing: false
        })
      }, 800) // 延迟800ms关闭，让用户看到提示

    } catch (error) {
      console.error('❌ 启动同步失败:', error)
      wx.showToast({
        title: '启动同步失败，请重试',
        icon: 'none',
        duration: 2000
      })
      
      that.setData({
        isSyncing: false
      })
    }
  },

  /**
   * 显示手动同步文章弹窗
   */
  showManualSyncModal: function(e) {
    this.setData({
      isManualSyncShow: true,
      manualSync: { articleUrl: '', defaultImageUrl: '', tempFilePath: '' }
    })
  },

  /**
   * 隐藏手动同步文章弹窗
   */
  hideManualSyncModal: function(e) {
    this.setData({
      isManualSyncShow: false,
      isManualSyncing: false,
      manualSync: { articleUrl: '', defaultImageUrl: '', tempFilePath: '' }
    })
  },

  /**
   * 选择默认图片
   */
  chooseDefaultImage: function(e) {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0]
        that.setData({
          'manualSync.tempFilePath': tempFilePath,
          'manualSync.defaultImageUrl': tempFilePath
        })
      },
      fail(err) {
        console.error('选择图片失败:', err)
        wx.showToast({
          title: '选择图片失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  /**
   * 提交手动同步文章
   */
  formManualSyncSubmit: async function(e) {
    const that = this
    const articleUrl = e.detail.value.articleUrl
    
    // 验证表单
    if (!articleUrl || articleUrl === '') {
      wx.showToast({
        title: '请输入文章链接',
        icon: 'none',
        duration: 1500
      })
      return
    }

    if (!that.data.manualSync.tempFilePath || that.data.manualSync.tempFilePath === '') {
      wx.showToast({
        title: '请选择默认图片',
        icon: 'none',
        duration: 1500
      })
      return
    }

    try {
      that.setData({
        isManualSyncing: true
      })

      wx.showLoading({
        title: '上传中...',
      })

      // 上传图片到云存储
      const timestamp = Date.now()
      const cloudPath = `manual-sync/${timestamp}-${Math.floor(Math.random() * 1000)}.jpg`
      const uploadRes = await api.uploadFile(cloudPath, that.data.manualSync.tempFilePath)
      
      if (!uploadRes.fileID) {
        throw new Error('图片上传失败')
      }

      wx.showLoading({
        title: '同步中...',
      })

      // 调用云函数手动同步文章
      const syncRes = await api.manualSyncArticle(articleUrl, uploadRes.fileID)
      
      wx.hideLoading()

      if (syncRes.result && syncRes.result.success) {
        wx.showToast({
          title: '同步成功',
          icon: 'success',
          duration: 2000
        })

        that.setData({
          isManualSyncShow: false,
          isManualSyncing: false,
          manualSync: { articleUrl: '', defaultImageUrl: '', tempFilePath: '' }
        })
      } else {
        throw new Error(syncRes.result?.message || '同步失败')
      }

    } catch (error) {
      console.error('手动同步文章失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: error.message || '同步失败，请重试',
        icon: 'none',
        duration: 2000
      })
      
      that.setData({
        isManualSyncing: false
      })
    }
  },
})