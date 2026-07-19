"use client";

import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

// 文章数据后续可以由 markdown 内容生成，这里保持客户端搜索结构
const posts = [
  {
    title: "欢迎来到我的博客",
    slug: "welcome",
    description: "记录项目、实验和技术笔记。",
  },
];

export default function PostsPage() {
  const [keyword, setKeyword] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "description"],
        threshold: 0.35,
      }),
    []
  );

  const result = keyword
    ? fuse.search(keyword).map((item) => item.item)
    : posts;

  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-32 text-black dark:bg-black dark:text-white">
      <section className="mx-auto w-full max-w-4xl rounded-3xl border border-black/10 bg-white/40 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
        <h1 className="text-4xl font-bold tracking-tight">Posts</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">
          浏览所有文章，并使用本地模糊搜索快速查找。
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-black/10 bg-white/30 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <Search className="h-5 w-5" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索文章..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <div className="mt-8 space-y-4">
          {result.map((post) => (
            <a
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="block rounded-2xl border border-black/10 bg-white/30 p-5 transition hover:bg-white/50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">
                {post.description}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
