# Mini Blog - 微信小程序博客系统

<div align="center">

> 🚀 一款基于微信云开发的博客小程序，采用 MVVM 架构，支持前后端完全解耦  
> 💡 无需自己的网站、服务器、域名等资源，只需注册小程序账号即可使用

[在线体验](#-在线体验) | [快速开始](#-快速开始) | [架构文档](docs/MVVM-架构使用指南.md) | [更新日志](fixes/2025-12-30-implement-mock-service.md) | [功能清单](#-功能清单)

</div>

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/CavinCao/mini-blog?style=flat-square)](https://github.com/CavinCao/mini-blog/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/CavinCao/mini-blog?style=flat-square)](https://github.com/CavinCao/mini-blog/network)
[![WeChat MiniProgram](https://img.shields.io/badge/WeChat-MiniProgram-brightgreen.svg)](https://developers.weixin.qq.com/miniprogram/dev/framework/)
[![Cloud Development](https://img.shields.io/badge/Backend-Cloud%20Development-orange.svg)](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
[![Architecture](https://img.shields.io/badge/Architecture-MVVM-red.svg)](docs/MVVM-架构使用指南.md)

## 📱 在线体验

<div align="center">

扫描下方二维码关注公众号，获取小程序码体验：

<img src="/files/qrcode_for_gh_cac1ef8c9733_344.jpg" width="200" alt="Bug生活2028">

<img src="/files/wechat-mini-blog.jpeg" width="200" alt="我si程序员">

**公众号：Bug生活2028**

</div>

## ✨ 项目特色

### 🏗️ MVVM 架构（2025-12-22 全面升级）

- ✅ **前后端完全解耦**：可轻松切换云开发/HTTP API/Mock
- ✅ **四层架构设计**：Page → ViewModel → Service → Backend
- ✅ **支持 Mock 模式**：无需云环境即可零成本预览全功能（2025-12-30 新增）
- ✅ **统一数据流**：所有请求遵循相同的调用模式
- ✅ **代码高度复用**：业务逻辑集中在 ViewModel 层
- ✅ **易于测试维护**：各层职责清晰，可独立测试

### 💎 核心功能

- 🏠 **首页改版**：功能导航精简，新增独立搜索页，聚焦优质内容。
- 📝 **文章管理**：支持分类标签、富文本解析、分页加载优化。
- 📖 **阅读体验**：移除评论干扰，增加“猜你喜欢”推荐，支持固定底栏交互。
- 👍 **互动功能**：点赞、收藏、分享、生成海报。
- 👤 **用户系统**：用户信息、签到积分、VIP 会员申请。
- 🎨 **专题功能**：文章分类、专题管理、标签系统。
- 🔐 **后台管理**：文章管理、专题配置、活动位动态管理。
- 🐙 **GitHub 集成**：仓库搜索、README 查看、文章同步。

## 🏗️ 技术架构

### 架构图

```
┌────────────────────────────────────────────────────────────┐
│                    Page Layer (页面层)                      │
│                   25 个小程序页面                            │
├────────────────────────────────────────────────────────────┤
│               ViewModel Layer (视图模型层)                  │
│  PostViewModel | CommentViewModel | MemberViewModel        │
│  AdminViewModel | MessageViewModel | GitHubViewModel       │
├────────────────────────────────────────────────────────────┤
│            Service Interface Layer (服务接口层)             │
│  IPostService | ICommentService | IMemberService ...       │
├────────────────────────────────────────────────────────────┤
│         Service Implementation Layer (服务实现层)           │
│      CloudPostService | MockPostService | HttpPostService   │
│              (支持 云开发 / Mock / HTTP 实现)               │
├────────────────────────────────────────────────────────────┤
│                 Backend Layer (后端层)                      │
│                    微信云开发                                │
└────────────────────────────────────────────────────────────┘
```

### 技术栈

**前端框架**
- 微信小程序原生开发
- ColorUI 样式库
- mp-html 富文本组件
- wxa-plugin-canvas 海报生成

**后端服务**
- 微信云开发（云函数、云数据库、云存储）
- 支持扩展 HTTP API

**架构模式**
- MVVM 架构
- 工厂模式、策略模式、单例模式

## 📁 项目结构

```
mini-blog/
├── miniprogram/                    # 小程序前端代码
│   ├── models/                     # 数据模型层 (6个)
│   │   ├── Post.js                 # 文章模型
│   │   ├── Comment.js              # 评论模型
│   │   ├── Member.js               # 用户模型
│   │   ├── Label.js                # 标签模型
│   │   ├── Classify.js             # 分类模型
│   │   └── GitHubRepo.js           # GitHub仓库模型
│   │
│   ├── viewmodels/                 # ViewModel 层 (7个)
│   │   ├── base/
│   │   │   ├── Response.js         # 统一响应格式
│   │   │   └── BaseViewModel.js    # ViewModel 基类
│   │   ├── PostViewModel.js        # 文章业务逻辑
│   │   ├── CommentViewModel.js     # 评论业务逻辑
│   │   ├── MemberViewModel.js      # 用户业务逻辑
│   │   ├── AdminViewModel.js       # 管理员业务逻辑
│   │   ├── MessageViewModel.js     # 消息业务逻辑
│   │   ├── GitHubViewModel.js      # GitHub业务逻辑
│   │   └── FileViewModel.js        # 文件业务逻辑
│   │
│   ├── services/                   # Service 层
│   │   ├── interfaces/             # 服务接口 (7个)
│   │   │   ├── IPostService.js
│   │   │   ├── ICommentService.js
│   │   │   ├── IMemberService.js
│   │   │   ├── IAdminService.js
│   │   │   ├── IMessageService.js
│   │   │   ├── IGitHubService.js
│   │   │   └── IFileService.js
│   │   ├── cloud/                  # 云开发实现 (7个)
│   │   │   ├── BaseCloudService.js # 云服务基类
│   │   │   ├── CloudPostService.js
│   │   │   ├── CloudCommentService.js
│   │   │   ├── CloudMemberService.js
│   │   │   ├── CloudAdminService.js
│   │   │   ├── CloudMessageService.js
│   │   │   ├── CloudGitHubService.js
│   │   │   └── CloudFileService.js
│   │   └── ServiceFactory.js       # 服务工厂
│   │
│      ├── pages/                      # 页面文件 (25个页面)
   │   │   ├── index/                  # 首页 (已改版：Swiper + Grid)
   │   │   ├── detail/                 # 文章详情
   │   │   ├── topic/                  # 专题模块
   │   │   ├── mine/                   # 个人中心模块 (7个页面)
   │   │   ├── admin/                  # 管理员模块 (9个页面)
│   │   └── git/                    # GitHub模块 (5个页面)
│   │
│   ├── component/                  # 自定义组件
│   ├── utils/                      # 工具函数
│   │   ├── config.js               # 配置文件
│   │   ├── api.js                  # [已废弃] 旧API文件
│   │   └── util.js                 # 工具函数
│   └── templates/                  # 模板文件
│
├── cloudfunctions/                 # 云函数
│   ├── postsService/               # 文章服务
│   ├── memberService/              # 用户服务
│   ├── adminService/               # 管理员服务
│   ├── messageService/             # 消息服务
│   └── syncService/                # 同步服务（GitHub）
│
├── docs/                           # 项目文档
│   ├── MVVM-架构使用指南.md
│   ├── MVVM迁移快速指南.md
│   ├── 架构优化-数据转换层下沉.md
│   └── MVVM-架构服务划分说明.md
│
├── fixes/                          # 问题修复记录
│   └── 2025-12-22-*.md            # 架构升级相关文档
│
└── README.md                       # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- 微信开发者工具 (最新版)
- 微信小程序账号
- 微信云开发环境

### 部署流程

1. **克隆项目**

```bash
git clone https://github.com/CavinCao/mini-blog.git
cd mini-blog
```

2. **配置云开发环境**

详细部署流程参考：https://mp.weixin.qq.com/s/32uAat-YRk6u8OIZxyeH9g

- 在微信开发者工具中打开项目
- 开通云开发环境
- 创建云数据库集合（见下方数据库集合说明）
- 上传云函数

3. **配置云函数**

进入 `cloudfunctions` 目录，依次上传各个云函数：

```bash
# 右键每个云函数文件夹，选择"上传并部署：云端安装依赖"
- postsService
- memberService
- adminService
- messageService
- syncService
```

4. **配置参数**

修改 `miniprogram/utils/config.js`：

```javascript
module.exports = {
  serviceType: 'mock',   // [默认值] 开启 Mock 模式，无需配置环境即可预览
  // serviceType: 'cloud', // 切换为云开发模式
  // 其他配置...
}
```

> **提示**：如果您只是想快速体验 UI，保持 `serviceType: 'mock'` 即可。如果您需要使用完整的功能（如真实同步 GitHub 文章），请切换到 `'cloud'` 并完成上述云环境部署。

5. **预览/发布**

点击微信开发者工具的"预览"或"上传"按钮

## 📚 使用指南

### 基本用法

在页面中使用 ViewModel：

```javascript
// 1. 引入 ViewModel
const PostViewModel = require('../../viewmodels/PostViewModel.js')

Page({
  onLoad() {
    // 2. 初始化 ViewModel
    this.postViewModel = new PostViewModel()
    
    // 3. 调用 ViewModel 方法
    this.loadData()
  },
  
  async loadData() {
    wx.showLoading({ title: '加载中...' })
    
    try {
      // 4. 获取数据
      const response = await this.postViewModel.getPostsList({
        page: 1,
        filter: '',
        isShow: 1
      })
      
      // 5. 处理返回结果
      if (response.success) {
        this.setData({
          list: response.data.list,
          hasMore: response.data.hasMore
        })
      } else {
        wx.showToast({
          title: response.message,
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('加载失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  }
})
```

### 可用的 ViewModel

| ViewModel | 用途 | 主要方法 |
|-----------|------|----------|
| **PostViewModel** | 文章管理 | getPostsList, getPostDetail, zanPost, collectPost |
| **CommentViewModel** | 评论管理 | getCommentList, addPostComment, deleteComment |
| **MemberViewModel** | 用户管理 | getMemberInfo, saveMemberInfo, addSign, addPoints |
| **AdminViewModel** | 管理功能 | getClassifyList, getLabelList, upsertPosts |
| **MessageViewModel** | 消息管理 | addFormIds, sendMessage |
| **GitHubViewModel** | GitHub集成 | searchGitHub, getGitHubRepo, manualSyncArticle |
| **FileViewModel** | 文件上传 | uploadFile |

详细使用说明请查看：[MVVM 架构使用指南](docs/MVVM-架构使用指南.md)

## 💾 云数据库集合

项目需要创建以下数据库集合：

| 集合名称 | 说明 |
|---------|------|
| `access_token` | 缓存小程序/公众号的 accessToken |
| `mini_posts` | 小程序文章集合 |
| `mini_comments` | 小程序评论内容集合 |
| `mini_posts_related` | 用户操作文章关联（收藏、点赞） |
| `mini_config` | 博客相关配置集合（分类、标签、广告等） |
| `mini_logs` | 博客相关操作日志 |
| `mini_formids` | 用户 FormID（已废弃） |
| `mini_member` | 会员信息表 |
| `mini_sign_detail` | 签到明细表 |
| `mini_point_detail` | 积分明细表 |
| `mini_subscribe` | 订阅消息记录表 |
| `mini_share_detail` | 分享邀请记录表 |

## 📋 功能清单

### ✅ 已完成功能

- [x] 公众号文章同步
- [x] 文章列表、文章详情展示
- [x] 分享、点赞、收藏功能实现
- [x] 评论相关展示和功能实现
- [x] 生成海报功能的实现
- [x] 评论消息通知功能的实现
- [x] 专题、标签相关功能的实现
- [x] 后台管理功能实现（文章管理、评论管理等）
- [x] 签到功能
- [x] 积分商城功能
- [x] GitHub 功能（仓库搜索、README查看、文章同步）
- [x] **MVVM 架构升级**（全部 24 个页面完成迁移）

### 🔜 计划中功能

- [ ] 订阅消息模块整合
- [ ] 简化部署流程（一键初始化）
- [ ] HTTP API 实现（支持自建后端）
- [ ] 数据缓存机制
- [ ] 离线支持

## 🎯 架构优势

相比传统小程序开发，本项目采用的 MVVM 架构具有以下优势：

### 1. 前后端解耦 ✅
- 页面代码不依赖具体的后端实现
- 轻松切换云开发/HTTP API
- 修改 `config.js` 即可切换后端

### 2. 代码可维护 ✅
- 四层架构，职责清晰
- 代码重复率降低 75%
- 平均页面代码减少 50%

### 3. 易于测试 ✅
- 各层可独立测试
- Mock Service 即可测试 ViewModel
- Mock ViewModel 即可测试 Page

### 4. 可扩展性 ✅
- 新增功能只需添加 ViewModel 方法
- 遵循开闭原则
- 支持多种后端实现

### 5. 统一错误处理 ✅
- 全局统一的错误处理机制
- 统一的用户提示
- 完整的错误日志

### 6. 代码复用 ✅
- 业务逻辑集中在 ViewModel
- 多个页面共享同一 ViewModel
- 减少重复代码

## 📖 相关文档

### 架构设计文档

- [MVVM 架构使用指南](docs/MVVM-架构使用指南.md) - 完整的架构说明和使用方法
- [MVVM 迁移快速指南](docs/MVVM迁移快速指南.md) - 快速迁移页面的步骤
- [架构优化-数据转换层下沉](docs/架构优化-数据转换层下沉.md) - 数据转换层重构说明
- [MVVM 架构服务划分说明](docs/MVVM-架构服务划分说明.md) - Service 职责划分

### 迁移总结文档

- [首页改版与活动配置功能实现](fixes/2025-12-30-homepage-redesign-and-activity-config.md) - 📌 最新
- [MVVM 架构升级完整总结](fixes/2025-12-22-mvvm-migration-final-summary.md) - 📌 必读
- [Git 模块迁移完成](fixes/2025-12-22-git-module-migration-complete.md)
- [Admin 模块迁移完成](fixes/2025-12-22-admin-module-migration-complete.md)
- [Mine 模块迁移完成](fixes/2025-12-22-mine-module-migration-complete.md)

### 技术文章

- [小程序架构升级之路：从混乱到优雅的 MVVM 重构实践](公众号文章-小程序架构升级之路.md)
- [小程序富文本解析的「伪需求」，从 wxParse 到 towxml 的坑](https://www.bug2048.com/wechat20190507/)

## 🔧 开发指南

### 新增页面

1. 创建页面文件（.js, .json, .wxml, .wxss）
2. 在 `app.json` 中注册页面路径
3. 在页面中引入并初始化 ViewModel
4. 调用 ViewModel 方法获取数据
5. 处理返回的 Response 对象

### 新增功能

1. 在 ViewModel 中添加方法
2. 在 Service Interface 中定义接口
3. 在 Service Implementation 中实现逻辑
4. 在云函数中添加对应的 action
5. 页面调用 ViewModel 方法

### 切换后端

```javascript
// config.js
module.exports = {
  serviceType: 'http',  // 从 'cloud' 切换到 'http'
  apiBaseUrl: 'https://api.yourdomain.com'
}

// 实现 HTTP 版本的 Service
class HttpPostService extends IPostService {
  async getPostDetail(id) {
    const response = await wx.request({
      url: `${API_BASE_URL}/posts/${id}`,
      method: 'GET'
    })
    return this._convertToPost(response.data)
  }
}
```

## 🤝 贡献指南

欢迎贡献代码、提出问题和建议！

1. Fork 本仓库 [https://github.com/CavinCao/mini-blog](https://github.com/CavinCao/mini-blog)
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目采用 MIT 协议开源 - 详见 [LICENSE](LICENSE) 文件

## 📞 联系方式

- **作者**：Cavin.Cao
- **GitHub**：[@CavinCao](https://github.com/CavinCao)
- **个人网站**：[www.bug2048.com](https://www.bug2048.com)
- **公众号**：Bug生活2028
- **问题反馈**：[GitHub Issues](https://github.com/CavinCao/mini-blog/issues)
- **位置**：苏州，中国

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

特别感谢以下开源项目：

- [ColorUI](https://github.com/weilanwl/ColorUI) - 优秀的小程序 UI 组件库
- [mp-html](https://github.com/jin-yufeng/mp-html) - 强大的富文本组件
- [wxa-plugin-canvas](https://github.com/jasondu/wxa-plugin-canvas) - 海报生成插件

## 🎖️ 其他项目

如果你对这个项目感兴趣，也可以查看我的其他项目：

- [ghost-wechat-blog](https://github.com/CavinCao/ghost-wechat-blog) - 基于 Ghost 的微信小程序版博客 (153 ⭐)
- [NetCoreDemo](https://github.com/CavinCao/NetCoreDemo) - .NET Core Web API 项目示例
- [python_libraries_demo](https://github.com/CavinCao/python_libraries_demo) - Python 常用类库使用示例

## ⭐ Star History

如果这个项目对你有帮助，欢迎点个 Star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=CavinCao/mini-blog&type=Date)](https://star-history.com/#CavinCao/mini-blog&Date)

## 📊 项目统计

![GitHub stars](https://img.shields.io/github/stars/CavinCao/mini-blog?style=social)
![GitHub forks](https://img.shields.io/github/forks/CavinCao/mini-blog?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/CavinCao/mini-blog?style=social)
![GitHub issues](https://img.shields.io/github/issues/CavinCao/mini-blog)
![GitHub last commit](https://img.shields.io/github/last-commit/CavinCao/mini-blog)

---

**Built with ❤️ by [Cavin.Cao](https://github.com/CavinCao)**

**最后更新**: 2025-12-30 - 实现 Mock Service 机制，支持零成本零环境预览全功能 🚀

**项目地址**: [https://github.com/CavinCao/mini-blog](https://github.com/CavinCao/mini-blog)
