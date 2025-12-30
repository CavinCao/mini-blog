const AdminViewModel = require('../../../viewmodels/AdminViewModel.js');
const FileViewModel = require('../../../viewmodels/FileViewModel.js');

Page({
  data: {
    configs: [
      { title: '', image_url: '', jump_url: '' },
      { title: '', image_url: '', jump_url: '' },
      { title: '', image_url: '', jump_url: '' },
      { title: '', image_url: '', jump_url: '' },
      { title: '', image_url: '', jump_url: '' }
    ]
  },

  onLoad: async function () {
    this.adminViewModel = new AdminViewModel();
    this.fileViewModel = new FileViewModel();
    await this.loadConfig();
  },

  /**
   * 加载配置
   */
  loadConfig: async function () {
    wx.showLoading({ title: '加载中...' });
    try {
      const response = await this.adminViewModel.getActivityConfig();
      if (response.success && response.data) {
        // 确保至少有5项
        let configs = response.data;
        while (configs.length < 5) {
          configs.push({ title: '', image_url: '', jump_url: '' });
        }
        this.setData({ configs });
      }
    } catch (error) {
      console.error('加载活动配置失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 输入监听
   */
  onInput: function (e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const configs = this.data.configs;
    configs[index][field] = value;
    this.setData({ configs });
  },

  /**
   * 清空单项配置
   */
  clearConfig: function (e) {
    const index = e.currentTarget.dataset.index;
    const configs = this.data.configs;
    configs[index] = { title: '', image_url: '', jump_url: '' };
    this.setData({ configs });
  },

  /**
   * 选择并上传图片
   */
  chooseImage: function (e) {
    const index = e.currentTarget.dataset.index;
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFilePaths[0];
        wx.showLoading({ title: '上传中...' });
        
        try {
          const timestamp = Date.now();
          const cloudPath = `activities/${timestamp}-${index}.jpg`;
          const uploadResponse = await that.fileViewModel.uploadFile(cloudPath, tempFilePath);
          
          if (uploadResponse.success) {
            const configs = that.data.configs;
            configs[index].image_url = uploadResponse.data.fileID;
            that.setData({ configs });
            wx.showToast({ title: '上传成功', icon: 'success' });
          } else {
            wx.showToast({ title: uploadResponse.message || '上传失败', icon: 'none' });
          }
        } catch (error) {
          console.error('上传图片出错:', error);
          wx.showToast({ title: '系统异常', icon: 'none' });
        } finally {
          wx.hideLoading();
        }
      }
    });
  },

  /**
   * 提交保存
   */
  formSubmit: async function () {
    const configs = this.data.configs.filter(item => item.title || item.image_url || item.jump_url);
    
    wx.showLoading({ title: '保存中...' });
    try {
      const response = await this.adminViewModel.saveActivityConfig(configs);
      if (response.success) {
        wx.showToast({ title: '保存成功', icon: 'success' });
      } else {
        wx.showToast({ title: response.message || '保存失败', icon: 'none' });
      }
    } catch (error) {
      console.error('保存活动配置出错:', error);
      wx.showToast({ title: '系统异常', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  }
});

