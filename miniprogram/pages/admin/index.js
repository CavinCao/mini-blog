const config = require('../../utils/config.js')
const util = require('../../utils/util.js');

// 【MVVM架构】引入 ViewModel
const AdminViewModel = require('../../viewmodels/AdminViewModel.js')
const MessageViewModel = require('../../viewmodels/MessageViewModel.js')
const GitHubViewModel = require('../../viewmodels/GitHubViewModel.js')
const FileViewModel = require('../../viewmodels/FileViewModel.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    formIds: [],
    formIdCount: 0,
    isReleaseShow: false,
    isManualSyncShow: false,
    isManualSyncing: false,
    manualSync: { articleUrl: '', defaultImageUrl: '', tempFilePath: '' },
    release: { releaseName: '', releaseDate: util.formatTime(new Date()), releaseContent: '' }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 【MVVM架构】初始化 ViewModel
    this.adminViewModel = new AdminViewModel()
    this.messageViewModel = new MessageViewModel()
    this.gitHubViewModel = new GitHubViewModel()
    this.fileViewModel = new FileViewModel()

    /*let that = this;
    let res = await this.messageViewModel.queryFormIds();
    if (res.success) {
      that.setData({
        formIdCount: res.data.formIds
      })
    }*/
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
      return
    }

    try {
      wx.showLoading({
        title: '保存中...',
      })

      let log = {
        releaseName: releaseName,
        releaseDate: releaseDate,
        releaseContent: releaseContent.split("\n")
      }

      let title = '小程序更新啦，赶紧来看看吧'

      // 【MVVM架构】使用 AdminViewModel
      const response = await that.adminViewModel.addReleaseLog(log, title)
      wx.hideLoading()
      
      if (response.success) {
        that.setData({
          isReleaseShow: false,
          release: { releaseName: '', releaseDate: util.formatTime(new Date()), releaseContent: '' }
        })

        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: response.message || '保存失败',
          icon: 'none',
          duration: 1500
        })
      }
    } catch (error) {
      wx.hideLoading()
      console.error('保存发布版本失败:', error)
      wx.showToast({
        title: '保存出错，请重试',
        icon: 'none',
        duration: 1500
      })
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

    try {
      wx.showLoading({
        title: '保存中...',
      })

      // 【MVVM架构】使用 MessageViewModel
      const response = await that.messageViewModel.addFormIds(that.data.formIds)
      wx.hideLoading()
      
      if (response.success) {
        that.setData({
          formIds: [],
          isShow: false
        })

        wx.showToast({
          title: '保存完成',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: response.message || '保存失败',
          icon: 'none',
          duration: 1500
        })
      }
    } catch (error) {
      wx.hideLoading()
      console.error('保存 formIds 失败:', error)
      wx.showToast({
        title: '保存出现异常',
        icon: 'none',
        duration: 1500
      })
    }
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
   * 跳转活动位配置
   */
  showActivityConfig: async function (e) {
    wx.navigateTo({
      url: '../admin/activity/activity'
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

      // 【MVVM架构】使用 FileViewModel 上传图片
      const timestamp = Date.now()
      const cloudPath = `manual-sync/${timestamp}-${Math.floor(Math.random() * 1000)}.jpg`
      const uploadResponse = await that.fileViewModel.uploadFile(cloudPath, that.data.manualSync.tempFilePath)
      
      if (!uploadResponse.success || !uploadResponse.data.fileID) {
        throw new Error(uploadResponse.message || '图片上传失败')
      }

      wx.showLoading({
        title: '同步中...',
      })

      // 【MVVM架构】使用 GitHubViewModel 手动同步文章
      const syncResponse = await that.gitHubViewModel.manualSyncArticle(articleUrl, uploadResponse.data.fileID)
      
      wx.hideLoading()

      if (syncResponse.success) {
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
        throw new Error(syncResponse.message || '同步失败')
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