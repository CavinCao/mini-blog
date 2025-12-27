const GitHubViewModel = require('../../../viewmodels/GitHubViewModel.js');
const util = require('../../../utils/util.js');

Page({
  data: {
    fullName: '',
    issues: [],
    page: 1,
    state: 'open', // open, closed
    isLoading: true,
    isMore: true,
    openCount: 0,
    closedCount: 0
  },

  onLoad: function (options) {
    // 初始化 ViewModel
    this.gitHubViewModel = new GitHubViewModel()
    
    this.setData({
      fullName: decodeURIComponent(options.full_name)
    });
    // Set title
    wx.setNavigationBarTitle({
      title: 'Issues'
    });
    
    this.loadIssues(true);
  },

  onReachBottom: function () {
    if (this.data.isMore && !this.data.isLoading) {
      this.setData({
        page: this.data.page + 1
      });
      this.loadIssues(false);
    }
  },

  async loadIssues(isRefresh) {
    if (isRefresh) {
      this.setData({
        page: 1,
        issues: [],
        isLoading: true,
        isMore: true
      });
    } else {
        this.setData({
            isLoading: true
        });
    }

    try {
      let res = await this.gitHubViewModel.getGitHubIssues(this.data.fullName, this.data.state, this.data.page);
      if (res.success && res.data) {
         let newIssues = res.data || [];
         if (!Array.isArray(newIssues)) {
             newIssues = []; 
         }

         // Format time
         newIssues.forEach(item => {
             item.updated_at = util.formatTime(new Date(item.updated_at));
             item.created_at_algo = util.timeAgo(item.created_at);
         });

         if (newIssues.length < 20) {
           this.setData({ isMore: false });
         }

         this.setData({
           issues: this.data.issues.concat(newIssues),
           isLoading: false
         });
      } else {
          this.setData({ isLoading: false, isMore: false });
      }
    } catch (err) {
      console.error(err);
      this.setData({ isLoading: false });
    }
  },

  tabSelect(e) {
    let state = e.currentTarget.dataset.id;
    if (state !== this.data.state) {
        this.setData({
            state: state
        });
        this.loadIssues(true);
    }
  },

  viewIssueDetail(e) {
    let url = e.currentTarget.dataset.url;
    // For now, copy URL or open in browser.
    // Or if we want to show detail in mini program, we need another page or parsing markdown.
    // The requirement says "展示对应详情" (show corresponding details) and points to attachment.
    // If the attachment is just the list, maybe "details" means the list of issues for the repo.
    // If user wants to click a specific issue, we might need a detail page.
    // But "view issue" on repo detail page -> Issue List.
    // Clicking an issue in the list -> Issue Detail.
    
    // Let's assume for now clicking list item copies URL or previews it.
    // Or maybe we can reuse the `towxml` page to show issue body?
    // Let's implement copying URL first or opening a webview if allowed.
    wx.setClipboardData({
        data: url,
        success: function() {
            wx.showToast({
                title: '链接已复制',
            })
        }
    })
  }
});

