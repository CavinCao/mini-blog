> `mini-blog`是一款基于云开发的博客小程序，该小程序完全不依赖任何后端服务，无需自己的网站、服务器、域名等资源，只需要自行注册小程序账号即可。


## 部署流程

最新部署流程参考：https://mp.weixin.qq.com/s/32uAat-YRk6u8OIZxyeH9g

其他教程文章可关注公众号查看
![Bug生活2028](/files/qrcode_for_gh_cac1ef8c9733_344.jpg)



## 当前进度与计划

- [x]  公众号文章同步
- [x]  文章列表、文章详情展示
- [x]  分享、点赞、收藏功能实现
- [x]  评论相关展示和功能实现
- [x]  生成海报功能的实现
- [x]  评论消息通知功能的实现
- [x]  专题、标签相关功能的实现
- [x]  后台管理功能实现（文章管理、评论管理等-基本完成了)
- [x]  签到功能
- [x]  积分商城功能
- [x]  git功能
- [待完成]  订阅消息模块整合
- [待完成]  简化部署流程「最好一键初始化」

## 云数据库对应集合

```
//缓存小程序or公众号的accessToken
access_token
//小程序文章集合
mini_posts
//小程序评论内容集合
mini_comments
//小程序用户操作文章关联（收藏、点赞）
mini_posts_related
//小程序博客相关配置集合
mini_config
//小程序博客相关操作日志
mini_logs
//小程序博客用户FormID（用于模板消息推送）[已经废弃]
mini_formids
//会员信息表
mini_member
//签到明细表
mini_sign_detail
//积分明细表
mini_point_detail
//订阅消息记录表
mini_subcribute
//分享邀请记录表
mini_share_detail
```


