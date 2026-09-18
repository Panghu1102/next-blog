---
title: "Next.js+Cloudflare worker添加PayloadCMS的尝试与踩坑"
date: 2026-09-18T15:34:30-04:00
categories:
  - Blog
tags:
  - CMS
  - cloudflare
---
  
# Next.js + Cloudflare Worker 添加 Payload CMS！尝试

> 一次并不算顺利的 CMS 接入记录：从 Next.js、OpenNext、Cloudflare Workers，到 D1、Payload CMS、Migration，再到一堆 Cloudflare Worker 报错。
>
> **本文记录的是实际尝试过程，而不是一篇“照着做就一定成功”的教程。**  

我在这篇文章里汇入了几乎所有我遇到的问题和报错…但是因为我也是第一次尝试，所以我没有按照往日的帖子那样留下图片。凑合看吧，希望可以给你提供点帮助，由于信息量太大，一些信息我使用了ai来汇总，不过应该是没错误的。

---

## 一、为什么突然想给博客加 CMS？

我的博客原本已经可以正常运行。

整体架构大致是：

```text
Next.js
   ↓
OpenNext
   ↓
Cloudflare Workers
   ↓
panghu.bond
```

文章内容以前主要通过 GitHub 仓库里的 Markdown 文件管理。

这种方案其实非常简单：

```text
编辑 Markdown
    ↓
Git commit
    ↓
GitHub
    ↓
Next.js 构建
    ↓
Cloudflare Worker
    ↓
博客页面
```

但用久了以后，总觉得编辑体验还是有点麻烦。

如果只是修改一篇 Markdown 文章，那么：

1. 找到文件；
2. 修改 Markdown；
3. 保存；
4. Git commit；
5. push；
6. 等待 Cloudflare 构建；
7. 最后才能看到网站上的变化。

而我真正想要的是一种更加接近社交平台的体验：

> 打开一个后台 → 写文章 → 富文本编辑 → 点击发布 → 网站直接出现文章。

也就是说，我想给自己的博客加一个真正的 CMS（其实到最后发现还是github方便哈哈哈）

---

# 二、为什么选择 Payload CMS？

一开始考虑过很多 CMS，不过最终尝试了 Payload。

原因比较简单。

Payload 本身：

- 开源；
- TypeScript 友好；
- 和 Next.js 结合比较自然；
- 自带 Admin Panel；
- 自带用户认证；
- 支持 Rich Text；
- 可以自己定义 Collection；
- 支持 SQLite；
- 而 Cloudflare 又提供了 D1。

于是我脑子里想象出来的架构大概是：

```text
                    ┌──────────────┐
                    │ Payload CMS  │
                    │    Admin     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Cloudflare D1│
                    │    blogcms   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Next.js Blog │
                    └──────────────┘
```

看起来……

**非常合理。**

然后我就开始了。

事实证明：

> 看起来合理 ≠ 真正部署起来简单。😂

---

# 三、项目原本的环境

这次使用的主要技术栈：

```text
Next.js
React
OpenNext
Cloudflare Workers
Cloudflare D1
Payload CMS
TypeScript
```

部署环境中出现过：

```text
Node.js 24.18.0
npm 10.9.2
Next.js 16.x
OpenNext for Cloudflare
Payload CMS 3.x
Wrangler 4.x
```

后来项目中的版本包括：

```text
Next.js 16.2.11
@opennextjs/cloudflare 1.20.2
Payload 3.89.x
React 19.2.1
Wrangler 4.88.0
```

这也埋下了后面的一些坑。

---

# 四、第一步：把 Payload 接进 Next.js

Payload 的核心配置最终大致变成了这样：

```ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { Posts } from "./src/collections/Posts";
import { Users } from "./src/collections/Users";

export default getCloudflareContext({ async: true }).then((cloudflare) => {
  const secret = process.env.PAYLOAD_SECRET;

  if (!secret) {
    throw new Error(
      "PAYLOAD_SECRET must be configured before Payload can start.",
    );
  }

  return buildConfig({
    admin: {
      user: Users.slug,
    },
    collections: [Users, Posts],
    db: sqliteD1Adapter({
      binding: cloudflare.env.blogcms,
    }),
    editor: lexicalEditor(),
    secret,
    typescript: {
      outputFile: "src/payload-types.ts",
    },
  });
});
```

这里最重要的一行就是：

```ts
binding: cloudflare.env.blogcms
```

因为 Payload 最终需要通过这个 binding 访问 Cloudflare D1。

我的 D1 数据库 binding 名字就是：

```text
blogcms
```

---

# 五、Users 和 Posts

## Users

用户 Collection 很简单：

```ts
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email" },
  auth: true,
  fields: [{ name: "name", type: "text", required: true }],
};
```

其中：

```ts
auth: true
```

意味着 Payload 会负责用户认证。

所以理论上：

```text
/admin/login
```

就可以直接进入 Payload 的登录页面。

---

# 六、Posts

博客文章 Collection 大概是：

```ts
import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",

  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedAt", "updatedAt"],
  },

  access: {
    read: ({ req: { user } }) =>
      user ? true : { status: { equals: "published" } },
  },

  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "description", type: "textarea" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayOnly" } },
    },
    {
      name: "categories",
      type: "array",
      fields: [{ name: "category", type: "text", required: true }],
    },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text", required: true }],
    },
    { name: "pinned", type: "checkbox", defaultValue: false },
    { name: "content", type: "richText", required: true },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
      ],
    },
  ],
};
```

这样一来，一篇文章基本就具备了：

```text
标题
Slug
描述
状态
发布时间
分类
标签
置顶
正文
SEO
```

而正文使用：

```text
Lexical Rich Text
```

正是我最想要的那种“不用手写 Markdown”的编辑体验。

---

# 七、然后问题来了：D1 是空的

Payload 虽然已经接进去了，但 Cloudflare D1 最开始基本是空数据库。

于是访问：

```text
https://panghu.bond/admin/login
```

直接出现：

```text
This page couldn’t load

A server error occurred.

ERROR 317763716
```

当时的第一反应很自然：

> Payload 要查 users，但是 D1 里面没有 Payload 的表。

于是开始研究 Payload 的 SQLite / D1 schema。

---

# 八、开始手动创建 D1 表

当时尝试在 D1 里创建 Payload 需要的表。

涉及：

```text
users
users_sessions
posts
posts_categories
posts_tags
payload_kv
payload_locked_documents
payload_locked_documents_rels
payload_preferences
payload_preferences_rels
payload_migrations
```

以及各种：

```text
indexes
foreign keys
unique constraints
```

这时候问题开始变复杂。

因为 Payload 并不是只有：

```text
users
posts
```

这么简单。

它自己还需要维护：

- session；
- locked documents；
- preferences；
- migrations；
- KV；
- relation tables。

---

# 九、Codespace 里的第一次坑：npm 安装失败

在 Codespace 里尝试准备 Payload migration 时，又遇到了另一个问题。

执行：

```bash
npm install --package-lock-only --ignore-scripts
```

结果被环境中的 package registry proxy 拒绝：

```text
blocked by the environment’s package-registry proxy returning HTTP 403.
```

于是后续：

```bash
npx tsc --noEmit
```

也没办法正常检查 Payload 相关代码，因为依赖并没有完整安装。

当时还尝试：

```bash
PAYLOAD_SECRET=development-only-not-a-secret npm run build
```

结果因为：

```text
@payloadcms/next/withPayload
```

没有成功安装，又导致构建失败。

这一阶段的核心问题其实不是代码，而是：

> **Codespace 的 npm registry / proxy 返回了 HTTP 403。**

---

# 十、Next.js / OpenNext 也开始报错

整个接入过程中还处理了多个 Next.js / OpenNext / Cloudflare 的问题。

包括：

- Next.js 版本和 OpenNext 支持情况；
- `next/og`；
- `jose`；
- wasm 文件；
- Cloudflare Worker runtime；
- Payload 在 Next.js build 阶段加载；
- Cloudflare binding 在 build/runtime 两种环境中的区别。

例如项目里后来出现了：

```ts
serverExternalPackages: [
  "@payloadcms/db-d1-sqlite",
  "jose",
],
```

以及：

```ts
turbopack: {},
```

还有：

```ts
webpack: (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    "next/og": false,
  };

  return config;
},
```

这些东西并不是 Payload 本身的功能，而是为了让它和 Next.js + OpenNext + Cloudflare 这一套环境一起工作。

---

# 十一、PAYLOAD_SECRET 问题

部署构建过程中还遇到过：

```text
PAYLOAD_SECRET must be configured before Payload can start.
```

原因很直接：

Payload 在启动时需要：

```text
PAYLOAD_SECRET
```

而 Cloudflare production 环境没有正确提供时，Payload 直接拒绝启动。

所以后来确认：

```text
PAYLOAD_SECRET
```

需要在 Cloudflare 环境中配置。

这个问题解决以后，项目又继续往下跑了。

---

# 十二、Next.js 页面里的 TypeScript 错误

之前还有一个 Payload Admin 页面相关的 TypeScript 错误。

大概涉及：

```text
src/app/(payload)/admin/[[...segments]]/page.tsx
```

因为 optional catch-all route 的：

```text
segments
```

可能是：

```text
undefined
```

所以后来需要把它规范化成：

```ts
[]
```

而不是直接假设一定存在。

这个问题解决以后，TypeScript 才继续通过。

---

# 十三、终于开始研究 Payload Migration

到了这里，我发现：

> 手工建表真的不是一个好主意。

于是开始研究 Payload 正式的 Migration 系统。

加入了：

```text
payload.config.migration.ts
```

以及：

```json
{
  "payload:migrate:create": "PAYLOAD_CONFIG_PATH=./payload.config.migration.ts payload migrate:create"
}
```

然后生成：

```text
src/migrations/20260918_135130_init_schema.ts
```

**这一步非常重要。**

因为从这一刻开始，我终于不需要再“猜 Payload 到底需要什么表”了。

---

# 十四、正式 Migration 到底创建了什么？

生成的 migration 创建了完整 schema。

## Users

```text
users
users_sessions
```

其中 `users` 包括：

```text
id
name
updated_at
created_at
email
reset_password_token
reset_password_expiration
salt
hash
login_attempts
lock_until
```

而 `users_sessions` 包括：

```text
_order
_parent_id
id
created_at
expires_at
```

以及对应的 foreign key 和 index。

---

# 十五、Posts

Migration 同样创建：

```text
posts
posts_categories
posts_tags
```

Posts 本身包括：

```text
id
title
slug
description
status
published_at
pinned
content
seo_title
seo_description
updated_at
created_at
```

还有：

```text
UNIQUE(slug)
```

等约束。

---

# 十六、Payload 自己的表

Migration 还创建：

```text
payload_kv
payload_locked_documents
payload_locked_documents_rels
payload_preferences
payload_preferences_rels
payload_migrations
```

所以整个数据库并不是：

```text
users + posts
```

而是：

```text
users
users_sessions

posts
posts_categories
posts_tags

payload_kv

payload_locked_documents
payload_locked_documents_rels

payload_preferences
payload_preferences_rels

payload_migrations
```

这也解释了为什么：

> **手工根据感觉建几个表，很容易漏东西。**

---

# 十七、一个很重要的误会：users_sessions.data

之前看到 Payload 登录相关的运行时 stack：

```text
SQLiteD1Session.prepareQuery
QueryPromise._prepare
QueryPromise.executeRaw
...
findOne
```

于是曾经怀疑：

```text
users_sessions.data
```

是不是缺少了。

甚至手工添加过：

```sql
ALTER TABLE users_sessions ADD COLUMN data TEXT;
```

但是后来真正查看正式生成的：

```text
src/migrations/20260918_135130_init_schema.ts
```

发现：

> **里面根本没有 `data` 这个字段。**

所以这个猜测被正式推翻。

这也是这次排查中非常重要的一点：

> **不能看到 runtime stack 就开始猜数据库 schema。**

真正应该相信的，是 Payload 根据当前 Config 生成出来的 migration。

---

# 十八、Cloudflare Migration 应该怎么做？

这里又遇到了 Cloudflare 环境的问题。

`payload.config.migration.ts` 主要是为了：

```text
生成 migration
```

它里面的 D1 binding 是一个 placeholder。

所以不能简单理解成：

```bash
npm run payload:migrate
```

然后就一定会把 migration 应用到 Cloudflare 上的：

```text
blogcms
```

真正的生产环境需要让 migration 使用**远程 D1**。

---

# 十九、研究 Payload 官方 Cloudflare D1 模板

后来研究了 Payload 官方的 Cloudflare D1 模板。

官方方案的核心思路是把部署拆成：

```text
deploy
├── deploy:database
│      ↓
│   Payload migrations
│      ↓
│   Remote D1
│
└── deploy:app
       ↓
    OpenNext build
       ↓
    Cloudflare Worker
```

也就是说：

> **数据库 migration 应该成为 Cloudflare 部署流程的一部分。**

而不是每次让我手动去 D1 Console 里创建表。

---

# 二十、Cloudflare binding 又出问题

为了让 Payload 在不同环境都能正确拿到 Cloudflare D1 binding，项目又进行了几次修改。

其中出现过：

```text
fix: load Payload Cloudflare bindings during build and runtime
```

以及：

```text
fix: remove unavailable __wrangler import from Payload config
```

这里的核心问题是：

Payload 会在不同环境运行：

```text
Payload CLI
Next.js build
OpenNext build
Cloudflare Worker runtime
```

而：

```ts
getCloudflareContext()
```

并不是在所有这些环境里都以完全相同的方式工作。

官方 Cloudflare D1 模板甚至会判断：

```ts
const isCLI = process.argv.some(...)
const isProduction = process.env.NODE_ENV === "production"
```

然后根据环境决定使用哪一种 Cloudflare context 获取方式。

这也是整个项目最麻烦的地方之一：

> **不是 Payload 不支持 Cloudflare，而是 Payload CLI、Next.js、OpenNext 和 Cloudflare Worker runtime 的执行环境并不完全一样。**

---

# 二十一、最终：博客首页终于正常

经过前面一堆问题之后：

```text
Next.js
↓
OpenNext
↓
Cloudflare Worker
```

这一部分已经可以正常工作。

也就是说：

```text
https://panghu.bond
```

博客主页能够正常访问。

所以问题已经逐渐从：

> “整个项目部署不了”

缩小到了：

> “Payload Admin 和 D1 数据库访问还有问题”。

---

# 二十二、/admin/login 第二次报错

后来再次访问：

```text
https://panghu.bond/admin/login
```

Worker 日志：

```json
{
  "level": "error",
  "message": "    at SQLiteD1Session.prepareQuery (worker.js:187855:38)\n    at QueryPromise._prepare (worker.js:187047:89)\n    at QueryPromise.executeRaw (worker.js:187087:25)\n    at QueryPromise.execute (worker.js:187090:25)\n    at QueryPromise.then (worker.js:183646:25)\n    at async find (worker.js:169373:27)\n    at async Object.findOne (worker.js:10737:20)\n    at async aH (worker.js:287324:35)"
}
```

完整请求：

```text
GET https://panghu.bond/admin/login
```

对应：

```text
scriptName: next-blog
executionModel: stateless
```

Worker version：

```text
f562fc32-03c8-45f2-84e6-68254dd29b29
```

Ray ID：

```text
a3d0fda3ccdb1509
```

Trace ID：

```text
be008ce051aaaac72bea92512e06b844
```

---

# 二十三、这次的错误编号也发生了变化

之前 Cloudflare 报：

```text
ERROR 317763716
```

后来修改代码之后，错误变成：

```text
ERROR 612214154
```

虽然错误编号发生了变化，但仅凭 Cloudflare 的错误编号不能直接判断具体原因。

真正有价值的是 Worker stack：

```text
SQLiteD1Session.prepareQuery
→ QueryPromise._prepare
→ QueryPromise.executeRaw
→ QueryPromise.execute
→ QueryPromise.then
→ find
→ findOne
```

这说明 Payload 已经走到了数据库查询这一层。

---

# 二十四、但是……D1 后台竟然没有 Query

然后出现了一个非常关键的新线索。

查看 Cloudflare D1 后台：

> **这个请求期间没有任何 Query，也没有任何 Write。**

也就是说：

```text
/admin/login
       ↓
Payload
       ↓
SQLiteD1Session.prepareQuery()
       ↓
❌
       ↓
D1
```

很可能根本没有成功到达：

```text
Cloudflare D1
```

如果 D1 后台确认没有 Query，那么继续：

```text
CREATE TABLE
ALTER TABLE
DROP TABLE
```

实际上都可能是在错误的方向上浪费时间。

---

# 二十五、所以现在真正怀疑的是哪里？

现在问题已经从：

```text
“D1 里面缺哪个表？”
```

变成：

```text
“为什么 SQLiteD1Session.prepareQuery()
没有成功把查询交给 D1？”
```

也就是：

```text
Payload
   ↓
@payloadcms/db-d1-sqlite
   ↓
Drizzle
   ↓
SQLiteD1Session
   ↓
Cloudflare D1 binding
   ↓
D1
```

目前真正值得检查的是：

```text
cloudflare.env.blogcms
```

到底是不是 Worker runtime 中一个正常的：

```text
D1Database
```

对象。

---

# 二十六、现在不应该再猜 users_sessions.data

这一点现在可以明确记录下来：

> **之前猜测 `users_sessions.data` 是错误方向。**

正式生成的 migration 中没有这个字段。

所以后续如果继续排查：

```text
不要：
ALTER TABLE users_sessions ADD COLUMN data TEXT
```

除非 Payload 当前实际运行的 SQL 明确报：

```text
no such column: users_sessions.data
```

否则没有理由添加。

---

# 二十七、目前真正应该做的事情

当前最合理的排查顺序已经变成：

```text
1. 检查 blogcms D1 binding
        ↓
2. 检查 Worker runtime 中 binding 是否正常
        ↓
3. 检查 SQLiteD1Session.prepareQuery()
        ↓
4. 检查它实际调用的 D1 API
        ↓
5. 检查 migration 是否已经应用
        ↓
6. 再检查具体 SQL
        ↓
7. 最后才是 schema
```

而不是：

```text
看到报错
↓
猜一个字段
↓
ALTER TABLE
↓
继续报错
↓
再猜一个字段
```

---

# 二十八、这次还学到一个很现实的东西

Cloudflare Worker 的日志有时候真的很“抽象”。

这次日志只给了：

```text
SQLiteD1Session.prepareQuery
```

却没有给：

```text
no such table: users
```

或者：

```text
no such column: xxx
```

所以单看日志很难判断。

如果能在安全范围内临时增加：

```text
typeof binding
binding.prepare
binding.batch
binding.exec
```

等 runtime diagnostic，就能判断：

> D1 binding 到底有没有正确进入 Worker。

当然不能把：

```text
密码
token
cookie
用户数据
```

这些东西打进日志。

---

# 二十九、当前项目的状态

到目前为止，可以把整个尝试总结成：

## 已经成功的部分

- [x] Next.js 博客
- [x] OpenNext
- [x] Cloudflare Worker
- [x] Cloudflare D1 binding
- [x] Payload 安装
- [x] Payload Config
- [x] Users Collection
- [x] Posts Collection
- [x] Rich Text
- [x] Payload Admin 路由进入运行流程
- [x] Payload Migration 成功生成
- [x] 正式 D1 schema 已经确定
- [x] `PAYLOAD_SECRET` 已配置
- [x] 多个 Next.js / OpenNext 构建问题已经处理

## 还没有完全成功的部分

- [ ] `/admin/login` 正常工作
- [ ] Payload 查询成功访问远程 D1
- [ ] Migration 自动进入 Cloudflare 部署流程
- [ ] CMS 真正投入日常使用
- [ ] 从 Payload Admin 创建、编辑、发布文章

---

# 三十、整个折腾过程其实可以浓缩成这样

最开始想的是：

```text
Next.js
 +
Payload
 +
D1
 =
CMS
```

实际变成：

```text
Next.js
   ↓
Next.js Config
   ↓
Payload
   ↓
Payload Config
   ↓
@payloadcms/next
   ↓
@payloadcms/db-d1-sqlite
   ↓
Drizzle
   ↓
SQLiteD1Session
   ↓
Cloudflare Context
   ↓
D1 Binding
   ↓
Cloudflare D1
```

然后其中任意一层出问题：

```text
💥
```

😂

---

# 三十一、这次尝试的阶段性结论

如果只是从“给博客增加一个 CMS”这个目标来看：

**确实比一开始想象得复杂很多。**

尤其是当博客本身已经运行在：

```text
Next.js
+
OpenNext
+
Cloudflare Workers
```

这样的 serverless 环境里以后，再加入一个需要：

```text
数据库
+
认证
+
Admin Panel
+
Migration
+
Runtime Adapter
```

的 CMS，就不再是简单的：

```bash
npm install payload
```

了。

真正复杂的地方其实不是 Payload Admin UI。

而是：

> **Payload 怎么在 Cloudflare Worker runtime 里获得正确的 D1 binding，并让它的数据库 adapter 正常工作。**

---

# 三十二、不过这次并不是完全白折腾

至少现在已经搞清楚了很多东西。

最重要的是：

### 原来的博客

```text
Markdown
→ GitHub
→ Build
→ Worker
```

### 理想中的新博客

```text
Payload Admin
→ D1
→ Next.js
→ Worker
```

而中间真正需要解决的，就是：

```text
Payload
     ↓
D1 Adapter
     ↓
Cloudflare Worker
```

这一段。

Migration 也已经正式生成：

```text
src/migrations/20260918_135130_init_schema.ts
```

以后不应该再手工猜表结构。

---

# 三十三、最终目标

如果最终成功，理想中的使用方式应该变成：

```text
打开 /admin
      ↓
登录
      ↓
Posts
      ↓
New Post
      ↓
富文本编辑器
      ↓
写文章
      ↓
选择分类 / Tags
      ↓
SEO
      ↓
Published
      ↓
保存
      ↓
博客页面出现
```

而原本的：

```text
Markdown
Git
Commit
Push
Build
Deploy
```

就可以逐渐从日常写作流程中退出。

---

# 三十四、结语

这次最大的感受就是：

> **“看起来只是加一个 CMS”，实际上是在给已经运行良好的 serverless 博客增加一整套后端系统。**

Payload 本身并没有想象中那么难。

真正麻烦的是：

```text
Payload
+
Next.js
+
OpenNext
+
Cloudflare Workers
+
D1
+
Migration
+
Runtime Binding
```

这些东西全部叠在一起。

目前这次尝试还没有彻底成功。

但是至少已经从：

> “/admin/login 为什么炸了？”

一路排查到了：

> “Payload 的 `SQLiteD1Session.prepareQuery()` 出错，而且 D1 后台甚至没有看到对应 Query，因此下一步应该检查 Worker runtime 中 D1 binding 和 adapter 的连接，而不是继续猜数据库字段。”

这也算是一个阶段性进展。

**Payload CMS × Cloudflare Workers 的故事，未完待续。**

---

## 附：这次遇到过的关键报错

### 1. Cloudflare Admin 登录

```text
This page couldn’t load

A server error occurred.

ERROR 317763716
```

后来错误编号变成：

```text
ERROR 612214154
```

---

### 2. Payload Secret

```text
PAYLOAD_SECRET must be configured before Payload can start.
```

---

### 3. npm registry

```text
npm install --package-lock-only --ignore-scripts

blocked by the environment’s package-registry proxy returning HTTP 403.
```

---

### 4. TypeScript

```text
src/app/(payload)/admin/[[...segments]]/page.tsx
```

optional segments 可能为 `undefined`，需要进行规范化处理。

---

### 5. Worker Runtime

```text
SQLiteD1Session.prepareQuery
QueryPromise._prepare
QueryPromise.executeRaw
QueryPromise.execute
QueryPromise.then
find
findOne
```

---

### 6. 最新的 Cloudflare Worker 请求

```text
GET https://panghu.bond/admin/login
```

Worker：

```text
scriptName: next-blog
executionModel: stateless
```

最新日志仍然落在：

```text
SQLiteD1Session.prepareQuery
```

---

### 7. D1 后台

最值得注意的一条：

```text
/admin/login 请求期间
D1 Query: 0
D1 Write: 0
```

因此当前最终排查方向：

```text
Payload
  ↓
SQLiteD1Session
  ↓
D1 binding
  ↓
❓
  ↓
Cloudflare D1
```

---

## 附：当前正式 Migration

项目目前已经有：

```text
src/migrations/20260918_135130_init_schema.ts
```

它负责创建：

```text
users
users_sessions

posts
posts_categories
posts_tags

payload_kv

payload_locked_documents
payload_locked_documents_rels

payload_preferences
payload_preferences_rels

payload_migrations
```

**后续应以这份 Payload 生成的 migration 作为 schema 的事实来源，而不是继续手工猜字段。**

---

> **怎么说呢，这个经历真的要给我整崩溃了，报错比文章里多得多，而且很长时间都是一个修不好。好的，最后的成果是payload可以运行，但是貌似并不太好用，而且由于注册过于简单，很可能会出现问题。我决定先用cloudflare access把payload的东西封堵一下，慢慢研究，暂时不用**  
需要什么的话可以discussion留言，如果我有，我可以找找给你






