const api = require('../../../utils/api.js');
const app = getApp();

Page({
  data: {
    fullName: '',
    path: '',
    branch: '',
    article: {},
    isLoading: true
  },

  onLoad: function (options) {
    let fullName = decodeURIComponent(options.full_name);
    let path = decodeURIComponent(options.path);
    let branch = options.branch || 'master';
    
    this.setData({
      fullName: fullName,
      path: path,
      branch: branch
    });

    this.getFileContent();
  },

  async getFileContent() {
    try {
      let res = await api.getGitHubContents(this.data.fullName, this.data.path, this.data.branch);
      if (res.result) {
        let content = res.result.content;
        let encoding = res.result.encoding;
        
        if (encoding === 'base64') {
          content = this.base64Decode(content);
        }

        // Use towxml to render
        let result = app.towxml(content, 'markdown', {
             theme: 'light'
        });
        
        this.setData({
            article: result,
            isLoading: false
        });
      }
    } catch (err) {
      console.error(err);
      this.setData({ isLoading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  base64Decode(str) {
      str = str.replace(/\n/g, '');
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let output = '';
      
      for (let bc = 0, bs = 0, buffer, i = 0;
          buffer = str.charAt(i++);

          ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
              bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
      ) {
          buffer = chars.indexOf(buffer);
      }
      return output;
  }
});

