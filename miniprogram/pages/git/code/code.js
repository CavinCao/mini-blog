const api = require('../../../utils/api.js');

Page({
  data: {
    fullName: '',
    path: '',
    branch: 'master', 
    branches: [],
    branchIndex: 0,
    contents: [],
    isLoading: true,
    history: [] 
  },

  onLoad: function (options) {
    let fullName = decodeURIComponent(options.full_name);
    let branch = options.branch || 'master';
    this.setData({
      fullName: fullName,
      branch: branch
    });
    this.getBranches();
    this.getContents('');
  },

  async getBranches() {
      try {
          let res = await api.getGitHubBranches(this.data.fullName);
          if (res && Array.isArray(res) && res.length > 0) {
              let branches = res.map(b => b.name);
              let index = branches.indexOf(this.data.branch);
              if (index === -1) index = 0;
              
              this.setData({
                  branches: branches,
                  branchIndex: index,
                  branch: branches[index]
              });
          }
      } catch (err) {
          console.error("Failed to fetch branches", err);
      }
  },

  handleBranchChange(e) {
      let index = e.detail.value;
      let branch = this.data.branches[index];
      this.setData({
          branchIndex: index,
          branch: branch,
          path: '',
          history: []
      });
      this.getContents('');
  },

  async getContents(path) {
    this.setData({ isLoading: true });
    try {
      let res = await api.getGitHubContents(this.data.fullName, path, this.data.branch);
      if (res.result) {
        let contents = res.result;
        // Sort: folders first, then files
        contents.sort((a, b) => {
          if (a.type === b.type) {
            return a.name.localeCompare(b.name);
          }
          return a.type === 'dir' ? -1 : 1;
        });

        this.setData({
          contents: contents,
          path: path,
          isLoading: false
        });
      } else {
          this.setData({ isLoading: false });
      }
    } catch (err) {
      console.error(err);
      this.setData({ isLoading: false });
    }
  },

  handleItemClick(e) {
    let item = e.currentTarget.dataset.item;
    if (item.type === 'dir') {
       let history = this.data.history;
       history.push(this.data.path);
       this.setData({ history: history });
       
       this.getContents(item.path);
    } else {
        wx.navigateTo({
            url: `/pages/git/file/file?full_name=${encodeURIComponent(this.data.fullName)}&path=${encodeURIComponent(item.path)}&branch=${this.data.branch}`
        })
    }
  },

  navigateBack() {
      let history = this.data.history;
      if (history.length > 0) {
          let prevPath = history.pop();
          this.setData({ history: history });
          this.getContents(prevPath);
      } else {
          wx.navigateBack();
      }
  }
});
