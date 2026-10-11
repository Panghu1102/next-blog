---
title: "零成本！大幅度提升cloudflare worker在大陆的访问"
description: "通过腾讯云 EdgeOne 反向代理和 Cloudflare 地区重定向，优化 Workers 网站在中国大陆的访问体验"
date: "2026-10-11"
---


## 前言

最近，我发现一个非常头疼的问题：**部署在 Cloudflare Workers 上的网站，在中国大陆地区的访问速度实在太慢了！**

倒不是完全无法连接，而是网页加载速度慢得离谱。有时候打开一个页面需要等待十几秒，甚至更长时间。尤其是在晚上，这种情况更加明显。

一开始，我甚至怀疑自己的域名是不是被 GFW 干扰了。但经过测试，我发现网站本身并没有出现故障，海外访问速度也基本正常，问题主要集中在中国大陆地区的网络连接上。

既然如此，有没有办法在不迁移 Cloudflare Workers 的情况下，提高国内用户的访问速度呢？

答案是：**利用腾讯云 EdgeOne 和 Cloudflare，实现网站的国内外分流！**

这篇文章就来介绍一下我的实际操作过程。

---

## 一、为什么要进行国内外分流？

Cloudflare 在全球拥有大量 CDN 节点，但对于中国大陆的普通免费用户来说，访问 Cloudflare 的体验并不总是理想。

尤其是部署在 Workers 上的网站，实际请求可能被路由到距离用户较远的节点。

这就导致一种比较尴尬的情况：

- 海外用户访问网站，速度非常快。
- 中国大陆用户访问网站，可能需要等待很长时间。
- 网站本身运行正常，并不存在明显的性能问题。

传统的解决方法包括优选 IP、更换 CDN、迁移服务器等。但是，这些方法并不一定适合 Cloudflare Workers。

例如，Workers 的执行和路由依赖 Cloudflare 自身的网络架构，简单修改 DNS 解析记录，并不能保证请求被调度到指定节点。

而将整个网站迁移到其他平台，又需要修改部署方式，甚至重新适配项目。

因此，我最终决定采用另一种方案：

**海外继续使用 Cloudflare，中国大陆则通过腾讯云 EdgeOne 进行访问加速。**

这样既不需要迁移网站，也能保留 Cloudflare Workers 原有的功能。

## 二、实现原理

整个方案并不复杂。我们需要准备两个不同的访问入口：

| 用户地区 | 访问入口 | CDN |
|---|---|---|
| 中国大陆 | cn.panghu.bond | 腾讯云 EdgeOne |
| 其他地区 | panghu.bond | Cloudflare |

两个入口最终都访问同一个 Cloudflare Workers 网站。

具体流程如下：

```text
                    用户访问网站
                         |
                         v
                    panghu.bond
                         |
                         v
                Cloudflare 判断地区
                         |
             +-----------+-----------+
             |                       |
             v                       v
         中国大陆                 其他地区
             |                       |
             v                       |
        307 重定向                  |
             |                       |
             v                       |
       cn.panghu.bond               |
             |                       |
             v                       |
       腾讯云 EdgeOne                |
             |                       |
             v                       |
       回源 panghu.bond              |
             |                       |
             +-----------+-----------+
                         |
                         v
                 Cloudflare Workers
                         |
                         v
                    返回网页内容
```

需要注意，这里并不是把 Workers 迁移到了 EdgeOne。

**EdgeOne 只是作为额外的 CDN 和反向代理入口，网站仍然运行在 Cloudflare Workers 上。**

因此，实际性能仍然受到 EdgeOne 到 Cloudflare 回源链路的影响。

另外，307 重定向需要先访问 Cloudflare 才能触发，所以它不能解决 Cloudflare 完全无法连接的情况。

## 三、准备工作

开始之前，需要准备以下资源：

1. 一个已经部署成功的 Cloudflare Workers 网站。
2. 一个自己拥有的域名。
3. 一个 Cloudflare 账户。
4. 一个腾讯云 EdgeOne 账户。
5. 一个用于国内访问的子域名。

本文使用以下域名作为示例：

| 用途 | 域名 |
|---|---|
| 原始网站 | panghu.bond |
| 国内加速入口 | cn.panghu.bond |
| 原始网盘 | drive.panghu.bond |
| 网盘加速入口 | cndrive.panghu.bond |

你可以根据自己的实际情况替换这些域名。

本文采用的是 EdgeOne 的境外加速区域，不需要使用中国大陆 CDN 节点。如果需要使用中国大陆 CDN 节点，则通常需要满足相应的 ICP 备案要求。

**特别提醒：EdgeOne 的境外加速区域不代表所有请求都会经过香港节点，也不保证一定比 Cloudflare 快。实际效果需要根据网络情况进行测试。**

---

## 四、将域名添加到 EdgeOne

首先进入腾讯云 EdgeOne 控制台。选择添加站点，输入需要加速的域名。这里以 `panghu.bond` 为例。

### 1. 验证域名所有权

由于我的域名 DNS 仍然托管在 Cloudflare，因此没有选择将整个域名的 DNS 托管迁移到 EdgeOne，而是使用 **TXT 记录验证**。

具体操作如下：

1. 在 EdgeOne 中添加站点。
2. 选择通过 TXT 记录验证域名所有权。
3. 复制 EdgeOne 提供的 TXT 记录名称和记录值。
4. 打开 Cloudflare DNS 管理页面。
5. 添加对应的 TXT 记录。
6. 返回 EdgeOne，完成域名验证。

这样就可以在不更换 DNS 托管服务商的情况下，将域名添加到 EdgeOne。

需要注意，域名验证成功不代表流量已经切换到 EdgeOne。接下来还需要配置加速域名和 DNS 记录。

### 2. 添加加速域名

验证完成后，在 EdgeOne 中添加需要加速的子域名。

我添加了两个：

```text
cn.panghu.bond
cndrive.panghu.bond
```

分别用于：

- 博客网站的国内加速。
- 个人网盘的国内加速。

这样可以避免直接修改原有网站的访问入口。即使 EdgeOne 出现问题，也不会立即影响原来的 Cloudflare 访问地址。

### 3. 配置加速区域

由于我的域名没有使用中国大陆 CDN 所需的备案，因此选择 EdgeOne 支持的境外加速区域。

这里需要根据自己的套餐和控制台提供的选项进行配置。

**选择境外加速，并不意味着 EdgeOne 一定会将中国大陆用户调度到香港节点。** 实际调度由 EdgeOne 决定，最终速度需要通过测试确认。

---

## 五、配置 EdgeOne 回源

这是整个教程中非常重要的一步。

我们需要让 EdgeOne 接收到用户请求后，将请求转发到原来的 Cloudflare Workers 网站。

### 1. 设置源站地址

我的配置如下：

| EdgeOne 加速域名 | 回源地址 |
|---|---|
| cn.panghu.bond | panghu.bond |
| cndrive.panghu.bond | drive.panghu.bond |

源站类型选择域名源站。这里填写的是原有网站域名，而不是服务器 IP。

因为网站本身部署在 Cloudflare Workers 上，并不存在需要手动填写的固定源站 IP。

### 2. 配置回源端口

我的配置为：

```text
HTTP：80
HTTPS：443
```

建议优先使用 HTTPS 回源，确保 EdgeOne 与 Cloudflare 之间的连接经过 TLS 加密。

### 3. 配置回源 Host

这里需要特别注意 Host 请求头。

以博客为例：

```text
用户访问：
cn.panghu.bond

EdgeOne 回源：
panghu.bond

回源 Host：
panghu.bond
```

网盘同理：

```text
用户访问：
cndrive.panghu.bond

EdgeOne 回源：
drive.panghu.bond

回源 Host：
drive.panghu.bond
```

这样可以让 Cloudflare 根据正确的域名匹配对应的网站或 Workers 路由。

如果 Host 配置不正确，可能会出现 404、路由不匹配或其他错误。

如果源站启用了 Cloudflare Access，还需要额外考虑身份验证和访问控制，不能简单地认为配置反向代理后就可以正常访问所有受保护资源。

### 4. 避免回源循环

还需要确保 `cn.panghu.bond` 不会再次被重定向回自己。

例如，错误的配置可能导致：

```text
cn.panghu.bond
       |
       v
panghu.bond
       |
       v
cn.panghu.bond
       |
       v
......
```

最终出现无限重定向。

因此，后续配置 Cloudflare 重定向规则时，必须明确匹配原始域名。

---

## 六、配置 SSL 证书

完成回源设置后，还需要为 EdgeOne 加速域名配置 HTTPS。

这里不得不吐槽一下：

**都 2026 年了，EdgeOne 的部分配置流程竟然还需要用户手动申请 SSL 证书……**

至少在我这次使用的配置中，证书并没有按照我预期的方式自动完成部署。

不过操作并不复杂。在 EdgeOne 的证书管理页面，为以下域名配置证书：

```text
cn.panghu.bond
cndrive.panghu.bond
```

证书签发成功后，将证书部署到对应的加速域名。

需要注意：Cloudflare 和 EdgeOne 使用不同的 SSL 证书完全正常。

例如：

```text
panghu.bond
    |
    +-- Cloudflare SSL

cn.panghu.bond
    |
    +-- EdgeOne SSL
```

浏览器只需要验证当前访问域名对应的证书是否有效，并不要求两个入口使用同一张证书。

另外，EdgeOne 到 Cloudflare 的 HTTPS 回源也需要正确验证源站证书。不要为了避免证书错误而随意关闭证书验证。

---

## 七、配置 CNAME 解析

完成 EdgeOne 的加速配置后，平台通常会提供对应的 CNAME 接入地址。

我们需要回到 Cloudflare DNS 管理页面，为国内加速域名添加 CNAME 记录。

例如：

```text
类型：CNAME
名称：cn
目标：EdgeOne 提供的 CNAME 地址
```

网盘也是一样：

```text
类型：CNAME
名称：cndrive
目标：EdgeOne 提供的 CNAME 地址
```

这里的目标地址必须使用 EdgeOne 控制台实际分配的地址，不要自行猜测。

**特别注意：Cloudflare 中用于指向 EdgeOne 的 CNAME 记录应设置为 DNS Only（仅 DNS），而不是 Proxied（已代理）。**

否则，用户请求可能仍然先进入 Cloudflare 代理，导致实际访问路径与预期不同。

配置完成后，可以通过 DNS 查询工具检查解析结果。

如果解析正确，就可以尝试直接访问：

```text
https://cn.panghu.bond
https://cndrive.panghu.bond
```

确认网站能够正常加载。此时，EdgeOne 反向代理就基本搭建完成了！

---

## 八、配置中国大陆地区自动重定向

虽然现在已经拥有了国内加速域名，但还有一个问题：

**中国大陆用户默认访问的仍然是 panghu.bond，而不是 cn.panghu.bond。**

总不能让每个国内用户都手动输入 `cn` 子域名吧？

因此，还需要配置自动重定向。

我的做法是使用 Cloudflare 的重定向规则，根据用户 IP 所在地区判断是否需要跳转。

### 1. 创建重定向规则

进入 Cloudflare 控制台，找到对应域名的重定向规则管理页面。创建一条新的 Single Redirect 规则。

匹配条件可以使用：

```text
(ip.geoip.country eq "CN" and http.host eq "panghu.bond")
```

这个表达式的意思是：当用户 IP 所在国家或地区为中国，并且访问的域名是 `panghu.bond` 时，触发重定向。

### 2. 设置目标地址

目标地址可以使用动态表达式：

```text
concat("https://cn.panghu.bond", http.request.uri.path)
```

同时开启保留查询字符串的选项。

这样就能实现：

```text
https://panghu.bond/
        |
        v
https://cn.panghu.bond/
```

对于文章页面：

```text
https://panghu.bond/zh/posts/example
        |
        v
https://cn.panghu.bond/zh/posts/example
```

原有的路径不会丢失。

### 3. 选择 307 重定向

我选择的是：**307 Temporary Redirect（临时重定向）。**

与永久重定向相比，307 更适合这种可能根据网络情况调整的分流方案。

307 还有一个特点：它会保留原始请求方法。例如，POST 请求经过 307 重定向后，仍然是 POST 请求。

不过，这并不代表所有上传或 API 请求都适合直接重定向。特别是涉及身份验证、跨域请求和文件上传时，需要额外测试。

### 4. 网盘配置

网盘可以创建另一条类似规则：

```text
(ip.geoip.country eq "CN" and http.host eq "drive.panghu.bond")
```

目标地址：

```text
concat("https://cndrive.panghu.bond", http.request.uri.path)
```

同样保留查询字符串。

这样，中国大陆用户访问原始网盘域名时，也会自动跳转到 EdgeOne 加速入口。

需要注意，网盘涉及文件上传、下载、登录和权限验证，因此需要重点测试这些功能。

---

## 九、测试分流是否成功

完成全部配置后，就可以开始测试了。

### 1. 测试国内访问

使用中国大陆网络访问：

```text
https://panghu.bond
```

正常情况下，浏览器应该收到 307 重定向，并跳转到：

```text
https://cn.panghu.bond
```

然后由 EdgeOne 提供加速服务。

### 2. 测试海外访问

使用海外网络访问：

```text
https://panghu.bond
```

正常情况下，不应该触发上述中国大陆地区重定向规则。网站继续通过 Cloudflare 访问。

### 3. 检查响应头

可以使用以下命令查看响应：

```bash
curl -I https://panghu.bond
```

如果要测试中国大陆地区的重定向，需要从中国大陆网络发起请求。

因为 Cloudflare 判断的是实际请求来源 IP，而不是命令中指定的地区。

成功触发时，应该能看到类似：

```http
HTTP/2 307
location: https://cn.panghu.bond/
```

还可以直接测试 EdgeOne 加速域名：

```bash
curl -I https://cn.panghu.bond
```

需要注意，不能只通过响应头中是否存在某个 CDN 标识来判断整个请求链路。

最好结合 EdgeOne 控制台的请求统计、访问日志以及实际测速结果进行确认。

### 4. 测试实际加载速度

可以使用 ITDOG 等网站测速工具，对比以下地址：

```text
panghu.bond
cn.panghu.bond
```

重点观察：

- TCP 连接时间。
- TLS 握手时间。
- 首字节响应时间（TTFB）。
- 完整网页加载时间。
- 不同地区的访问成功率。

建议分别测试白天和晚上。因为中国大陆到境外网络的连接质量可能随着时间发生明显变化。

此外，还应该分别测试首次访问和重复访问。

EdgeOne 缓存命中后，静态资源可能会获得更好的加载速度。但对于需要实时执行的动态 Workers 请求，EdgeOne 仍然可能需要向 Cloudflare 回源。

因此，不能将所有性能提升都归功于缓存。

---

## 十、最终效果

经过实际配置和测试，我发现这种方案确实改善了自己网站在中国大陆地区的访问体验。

原本通过 Cloudflare 直接访问时，部分地区加载速度非常慢。而通过 EdgeOne 反向代理之后，访问速度明显提高。

尤其是在此前访问体验较差的情况下，改善非常直观。

最终，我实现了以下访问方式：

**中国大陆：**

```text
用户
 |
 v
Cloudflare 地区判断
 |
 v
307 重定向
 |
 v
腾讯云 EdgeOne
 |
 v
Cloudflare Workers
```

**其他地区：**

```text
用户
 |
 v
Cloudflare
 |
 v
Cloudflare Workers
```

这样既保留了原有 Workers 部署方式，又为国内用户提供了一个额外的加速入口。

不过需要说明，这种方案并不能保证所有地区都实现秒开。

实际效果取决于当地运营商、EdgeOne 节点调度、回源链路以及网站本身的资源结构。

## 十一、一些需要注意的问题

虽然整个方案比较简单，但实际使用时还有几个需要注意的地方。

### 1. 重定向不能解决完全无法连接的问题

这是本方案最明显的局限。

因为中国大陆用户仍然需要先访问 Cloudflare，才能收到 307 重定向。

如果 Cloudflare 完全无法连接，那么重定向也无法执行。

所以，这种方案更适合：**Cloudflare 可以连接，但访问速度比较慢的情况。**

如果需要彻底避免国内用户首先连接 Cloudflare，则需要考虑 DNS 地理位置解析等其他方案。

### 2. EdgeOne 仍然需要回源 Cloudflare

EdgeOne 并没有取代 Workers。

如果请求没有命中缓存，EdgeOne 仍然需要访问原来的 Cloudflare 网站。

因此，性能取决于：

```text
用户 → EdgeOne → Cloudflare
```

这条链路的整体质量。

如果 EdgeOne 到 Cloudflare 的回源连接出现问题，网站依然可能加载缓慢。

### 3. 不要随意缓存私人文件

对于普通博客，缓存图片、CSS、JavaScript 等静态资源通常没有太大问题。

但是对于网盘，需要格外小心，尤其是涉及：

- 私人文件。
- 登录状态。
- Cloudflare Access。
- 带有身份验证信息的请求。
- 用户专属下载链接。

不要直接对所有路径开启无差别缓存。

否则可能导致身份验证异常，甚至出现私人内容被错误缓存的问题。

### 4. 注意两个 CDN 的缓存规则

Cloudflare 和 EdgeOne 都有各自的缓存机制。

当两个 CDN 串联时，可能出现：

```text
用户
 |
 v
EdgeOne 缓存
 |
 v
Cloudflare 缓存
 |
 v
源站
```

因此，更新网站后，如果发现国内用户仍然访问旧版本内容，可以分别检查两个平台的缓存。

必要时，需要同时清理 EdgeOne 和 Cloudflare 的相关缓存。

### 5. 注意跨域和 Cookie 问题

`panghu.bond` 和 `cn.panghu.bond` 虽然属于同一个主域名，但仍然是不同的主机名。

如果网站使用了限定主机名的 Cookie、OAuth 登录回调、严格的 CSP 或 CORS 配置，切换域名后可能出现兼容性问题。

尤其是个人网盘这类具有登录和上传功能的网站，最好在正式启用分流前进行完整测试。

---

## 十二、总结

这次折腾下来，我发现：

**对于已经部署在 Cloudflare Workers 上的网站，利用 EdgeOne 反向代理，再结合 Cloudflare 地区重定向，确实是一种值得尝试的国内访问优化方案。**

它最大的优势就是不需要迁移原来的 Workers 项目。

整个过程主要涉及：

1. 在 EdgeOne 中验证域名所有权。
2. 添加国内加速子域名。
3. 配置 Cloudflare Workers 原有域名作为回源地址。
4. 配置 HTTPS 证书。
5. 添加 CNAME 解析。
6. 使用 Cloudflare 的 307 重定向实现地区分流。
7. 分别测试国内外访问效果。

当然，这并不是一个完美的解决方案。

它仍然依赖 Cloudflare 完成首次地区判断，也需要考虑 CDN 回源、缓存、SSL 和身份验证等问题。

但对于我的实际使用场景来说，已经取得了比较明显的改善。

最重要的是，整个网站不需要重新部署，也不用修改原有 Workers 的代码。

**如果你也遇到了 Cloudflare Workers 在中国大陆地区访问缓慢的问题，不妨试试这种方案！**
