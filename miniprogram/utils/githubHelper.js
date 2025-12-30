/**
 * GitHub API 辅助工具类
 * 用于在小程序端直接调用 GitHub API，不再依赖云函数
 */

const BASE_URL = 'https://api.github.com';

/**
 * 通用请求方法
 * @param {Object} options 请求配置
 */
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url.startsWith('http') ? options.url : `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Accept': 'application/vnd.github.v3+json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          console.error('GitHub API 响应错误:', res);
          reject(new Error(res.data?.message || `请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        console.error('GitHub API 请求失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 搜索 GitHub 仓库
 * @param {string} keyword 关键词
 * @param {number} page 页码
 */
async function searchGitHub(keyword, page = 1) {
  return await request({
    url: '/search/repositories',
    data: {
      q: keyword,
      sort: 'stars',
      order: 'desc',
      page: page,
      per_page: 20
    }
  });
}

/**
 * 获取 GitHub 仓库详情
 * @param {string} fullName 仓库全名 (owner/repo)
 */
async function getGitHubRepo(fullName) {
  return await request({
    url: `/repos/${fullName}`
  });
}

/**
 * 获取 GitHub 仓库 README
 * @param {string} fullName 仓库全名 (owner/repo)
 */
async function getGitHubReadme(fullName) {
  try {
    const result = await request({
      url: `/repos/${fullName}/readme`
    });

    if (result.content && result.encoding === 'base64') {
      // 微信小程序可以使用 base64 解码，但需要处理换行符
      const base64 = result.content.replace(/\s/g, '');
      return decodeURIComponent(escape(atob(base64)));
    }
    return "";
  } catch (err) {
    console.error('获取README失败:', err);
    return "";
  }
}

/**
 * 获取 GitHub 仓库内容
 * @param {string} fullName 仓库全名 (owner/repo)
 * @param {string} path 文件路径
 * @param {string} ref 分支/标签/提交ID
 */
async function getGitHubContents(fullName, path = '', ref = '') {
  let url = `/repos/${fullName}/contents`;
  if (path) {
    url += `/${path}`;
  }

  const data = {};
  if (ref) {
    data.ref = ref;
  }

  return await request({
    url,
    data
  });
}

/**
 * 获取 GitHub 仓库分支列表
 * @param {string} fullName 仓库全名 (owner/repo)
 */
async function getGitHubBranches(fullName) {
  return await request({
    url: `/repos/${fullName}/branches`
  });
}

/**
 * 获取 GitHub 仓库 Issues
 * @param {string} fullName 仓库全名 (owner/repo)
 * @param {string} state 状态 (open/closed/all)
 * @param {number} page 页码
 */
async function getGitHubIssues(fullName, state = 'open', page = 1) {
  return await request({
    url: `/repos/${fullName}/issues`,
    data: {
      state,
      page,
      per_page: 20,
      sort: 'updated'
    }
  });
}

/**
 * Base64 解码辅助函数 (小程序环境可能没有 atob)
 * 如果 atob 不存在，使用基础实现
 */
function atob(input) {
  if (typeof global !== 'undefined' && global.atob) return global.atob(input);
  if (typeof window !== 'undefined' && window.atob) return window.atob(input);
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = String(input).replace(/[=]+$/, '');
  let output = '';
  if (str.length % 4 === 1) throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  for (
    let bc = 0, bs, buffer, idx = 0;
    (buffer = str.charAt(idx++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer),
      bc++ % 4) ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)))) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  return output;
}

module.exports = {
  searchGitHub,
  getGitHubRepo,
  getGitHubReadme,
  getGitHubContents,
  getGitHubBranches,
  getGitHubIssues
};

