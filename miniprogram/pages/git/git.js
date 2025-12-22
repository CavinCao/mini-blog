// 【MVVM架构】引入 ViewModel
const GitHubViewModel = require('../../viewmodels/GitHubViewModel.js')

Page({
  data: {
    CustomBar: 0,
    searchKeyword: '',
    repoList: [],
    hotSearch: ['AI', 'LLM', 'React', 'Vue', 'Flutter', 'TensorFlow', 'PyTorch', 'Stable Diffusion', 'Next.js'],
    historySearch: [],
    showHot: true,
    isLoading: false,
    page: 1,
    nodata: false,
    totalCount: 0
  },

  onLoad: function (options) {
    // 【MVVM架构】初始化 ViewModel
    this.gitHubViewModel = new GitHubViewModel()

    let history = wx.getStorageSync('github_search_history') || [];
    this.setData({
      historySearch: history
    });
  },

  handleInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    if (!e.detail.value) {
      this.setData({
        showHot: true,
        repoList: [],
        nodata: false
      });
    }
  },

  handleSearch(e) {
    let keyword = e.detail.value || this.data.searchKeyword;
    if (!keyword) return;
    this.doSearch(keyword);
  },

  handleTagSearch(e) {
    let keyword = e.currentTarget.dataset.keyword;
    this.setData({
      searchKeyword: keyword
    });
    this.doSearch(keyword);
  },

  handleClearHistory() {
    wx.setStorageSync('github_search_history', []);
    this.setData({
      historySearch: []
    });
  },

  async doSearch(keyword, isLoadMore = false) {
    if (this.data.isLoading) return;

    if (!isLoadMore) {
      this.setData({
        showHot: false,
        isLoading: true,
        page: 1,
        repoList: [],
        nodata: false
      });
      
      // Save history
      let history = this.data.historySearch;
      history = history.filter(item => item !== keyword);
      history.unshift(keyword);
      if (history.length > 10) history.pop();
      
      wx.setStorageSync('github_search_history', history);
      this.setData({ historySearch: history });
    } else {
      this.setData({
        isLoading: true
      });
    }

    wx.showLoading({ title: '加载中...' });

    try {
      // 【MVVM架构】使用 GitHubViewModel
      const response = await this.gitHubViewModel.searchGitHub(keyword, this.data.page);
      console.log('GitHub Search Result:', response);
      
      if (!response.success) {
        throw new Error(response.message || '搜索失败');
      }

      const items = response.data.items || [];
      const total_count = response.data.total_count || 0;
      
      if (!isLoadMore) {
        this.setData({ totalCount: total_count });
      }

      items.forEach(item => {
        item.updated_at = item.updated_at ? item.updated_at.substring(0, 10) : '';
      });

      if (isLoadMore) {
        if (items.length === 0) {
          wx.showToast({ title: '没有更多数据了', icon: 'none' });
        } else {
          this.setData({
            repoList: this.data.repoList.concat(items)
          });
        }
      } else {
        if (items.length === 0) {
          this.setData({ nodata: true });
        } else {
          this.setData({
            repoList: items
          });
        }
      }
    } catch (err) {
      console.error('GitHub搜索失败:', err);
      wx.showToast({ title: err.message || '搜索失败', icon: 'none' });
      if (!isLoadMore) {
        this.setData({ nodata: true });
      }
    } finally {
      wx.hideLoading();
      this.setData({ isLoading: false });
      wx.stopPullDownRefresh();
    }
  },

  onReachBottom: function () {
    if (!this.data.showHot && !this.data.nodata) {
      this.setData({
        page: this.data.page + 1
      });
      this.doSearch(this.data.searchKeyword, true);
    }
  },

  onPullDownRefresh: function () {
    if (this.data.searchKeyword) {
      this.doSearch(this.data.searchKeyword, false);
    } else {
      wx.stopPullDownRefresh();
    }
  },
  
  bindRepoDetail(e) {
    let fullName = e.currentTarget.dataset.fullname;
    wx.navigateTo({
      url: '/pages/git/detail/detail?full_name=' + encodeURIComponent(fullName),
    })
  }
});
