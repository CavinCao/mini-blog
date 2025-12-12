const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();

Page({
  data: {
    repo: {},
    readme: '',
    isLoading: true,
    isReadmeLoading: true
  },

  onLoad: function (options) {
    let fullName = decodeURIComponent(options.full_name);
    this.setData({
      'repo.full_name': fullName
    });
    this.getRepoDetail(fullName);
    this.getRepoReadme(fullName);
  },

  async getRepoDetail(fullName) {
    try {
      //let res = await api.searchGitHub(fullName, 1); // Re-using search or creating new specific API?
      // Actually searchGitHub returns a list. It's better to get specific repo detail.
      // I'll add getRepoDetail to api.js and syncService.
      // For now, let's assume I might pass the basic info from previous page to show quickly.
      // But better to fetch fresh.
      
      // If I don't have getRepoDetail yet, I can implementation it.
      // Let's implement getGitHubRepo in api/syncService.
      
      let repoRes = await api.getGitHubRepo(fullName);
      if (repoRes.result) {
         let repo = repoRes.result;
         repo.updated_at = repo.updated_at ? repo.updated_at.substring(0, 10) : '';
         repo.created_at = repo.created_at ? repo.created_at.substring(0, 10) : '';
         this.setData({
           repo: repo,
           isLoading: false
         });
      }
    } catch (err) {
      console.error(err);
      this.setData({ isLoading: false });
    }
  },

  async getRepoReadme(fullName) {
    try {
      let res = await api.getGitHubReadme(fullName);
      if (res.result) {
        let content = res.result;
        
        // 解析 markdown
        let result = app.towxml(content, 'markdown', {
          theme: 'light',
          events: {
            tap: (e) => {
              console.log('tap', e);
            }
          }
        });

        this.setData({
          readme: result,
          isReadmeLoading: false
        });
      }
    } catch (err) {
      console.error(err);
      this.setData({ isReadmeLoading: false });
    }
  },

  copyUrl() {
    wx.setClipboardData({
      data: this.data.repo.html_url,
      success: function () {
        wx.showToast({
          title: '链接已复制',
        })
      }
    })
  },
  
  viewCode() {
      // Maybe open in browser or just copy link
      // this.copyUrl();
      let branch = this.data.repo.default_branch || 'master';
      wx.navigateTo({
        url: `/pages/git/code/code?full_name=${encodeURIComponent(this.data.repo.full_name)}&branch=${branch}`,
      })
  },
  
  viewIssues() {
      wx.navigateTo({
        url: `/pages/git/issue/issue?full_name=${encodeURIComponent(this.data.repo.full_name)}`,
      })
  }
});
