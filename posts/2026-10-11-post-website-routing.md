---
title: "网站分流！优化网站在中国大陆地区的访问速度"
description: "使用 EdgeOne 和 Cloudflare Workers 实现网站国内外分流"
date: "2026-10-11"
---

最近我发现托管在cloudflare worker上的网站在大陆地区直接访问速度会非常非常的慢，不是连接不到，但是加载速度慢的离谱！我甚至怀疑我的域名是不是被GFW搞了…这现象在夜晚的时候非常常见。

为了解决这个问题，我选择了分流，因为网站本身是部署在worker上，所以传统的优选ip之类的并不能管用，而把worker进行迁移的成本又太高，综合一下，我决定了chame

其实很简单，edgeone有几个免费的cdn套餐，虽然大陆的cdn要备案不能用，但是香港的依旧可以，至少最终结果比cloudflare强

我现把域名通过txt验证的方式添加到edgeone，随后把cn.panghu.bond和cndrive.panghu.bond添加到了其中（这里必须吐槽edgeone，2026年了竟然还要求用户手动申请ssl…）回源填worker的两个域名，就是panghu.bond和drive.panghu.bond。http用80端口，https用443。请求头也选择回源

这样一个反带就搭建好了！

但是大陆的请求还不见得都到了cn下。我又去域名后台，添加了两个重定向，当检测到是大陆的ip在请求panghu.bond时，307到cn.panghu.bond。尽管大陆打开网页很慢，但是请求是过得去的，因此重定向可以直接完成！

最后，就实现了大陆和全球地区网页秒开的效果！

真的很实用！
