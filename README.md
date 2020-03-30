> `mini-blog`是一款基于云开发的博客小程序，该小程序完全不依赖任何后端服务，无需自己的网站、服务器、域名等资源，只需要自行注册小程序账号即可。


## 相关使用和文章介绍

- [[mini-blog][v2.0.0]博客小程序的一些优化汇总](https://mp.weixin.qq.com/s/V0IwsCx0b0PGIVz6EGaGnQ)

- [[mini-blog]小程序订阅消息踩坑记](https://mp.weixin.qq.com/s/MWSJ4pWBQW1vhEpqj2HEAA)

- [[mini-blog]第一次部署过程中的问题点总结(最近很多人在问)](https://mp.weixin.qq.com/s/GLNSHdWIowwdb5_GHPJkmg)

- [[mini-blog]小程序最近两个迭代版本总结，来看看更新了哪些内容吧](https://mp.weixin.qq.com/s/gmoHSnvw0E6Wld3PewDJNA)

- [[mini-blog][v1.6.0]体现后台管理功能的价值时刻到了——丰富文章的筛选](https://mp.weixin.qq.com/s/TDeBq9oDFxgEIB4vATM3nA)

- [公众号文章同步至云数据库实现](https://www.bug2048.com/wechat20190421/)

- [[mini-blog]基于云开发的博客小程序诞生](https://www.bug2048.com/wechat20190429/)

- [[mini-blog]基于云开发的博客小程序使用教程](https://www.bug2048.com/wechat20190505/)

- [小程序富文本解析的「伪需求」，从wxParse到towxml的坑](https://www.bug2048.com/wechat20190507/)

- [基于云开发的小程序评论、点赞、收藏功能实现总结](https://www.bug2048.com/wechat20190511/)

- [基于云开发的小程序海报功能的实现](https://www.bug2048.com/wechat20190512/)

- [[mini-blog]小程序后台管理功能的实现](https://mp.weixin.qq.com/s/0Wy0RMfsbsl1mpvxN8bPrg)


## 当前进度与计划

- [x]  公众号文章同步
- [x]  文章列表、文章详情展示
- [x]  分享、点赞、收藏功能实现
- [x]  评论相关展示和功能实现
- [x]  生成海报功能的实现
- [x]  评论消息通知功能的实现
- [x]  专题、标签相关功能的实现
- [x]  后台管理功能实现（文章管理、评论管理等-基本完成了)

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
```


## 小程序二维码：
![image](http://image.bug2048.com/gh_660886427113_344.jpg)


> 博客地址：[http//:www.bug2048.com](https://www.bug2048.com/) 

> 微信公众号与微信：Bug生活2048

![image](https://www.bug2048.com//content/images/2018/02/qrcode_for_gh_cac1ef8c9733_258.jpg)  ![image](http://image.bug2048.com/WechatIMG2.jpeg?imageView2/1/w/200/h/200/q/100)

