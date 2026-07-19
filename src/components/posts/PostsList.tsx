"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { PostMeta } from "@/lib/posts";

type PostsListProps = {
  posts: PostMeta[];
};

export function PostsList({ posts }: PostsListProps) {
  const [keyword, setKeyword] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "description", "date"],
        threshold: 0.35,
      }),
    [posts]
  );

  const result = keyword ? fuse.search(keyword).map((item) => item.item) : posts;

  return (
    <main className="min-h-screen overflow-hidden bg-white px-6 pb-20 pt-32 text-black dark:bg-black dark:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_32rem),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.16),transparent_30rem)]" />
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="mx-auto w-full max-w-4xl rounded-3xl border border-black/10 bg-white/50 p-8 shadow-2xl shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/45 dark:shadow-white/5"
      >
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-black/45 dark:text-white/45">Markdown Journal</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Posts</h1>
        <p className="mt-3 max-w-2xl text-black/60 dark:text-white/60">
          自动读取仓库根目录 <span className="font-mono">posts</span> 文件夹中的 Markdown 文章，并使用本地模糊搜索快速查找。
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-black/10 bg-white/50 px-4 py-3 shadow-inner backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <Search className="h-5 w-5 text-black/45 dark:text-white/45" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索文章标题、简介或日期..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-black/35 dark:placeholder:text-white/35"
          />
        </div>

        <div className="mt-8 grid gap-4">
          {result.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
            >
              <Link
                href={`/posts/${post.slug}`}
                className="group block rounded-2xl border border-black/10 bg-white/45 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/75 hover:shadow-xl hover:shadow-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-white/5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-300">{post.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">{post.description}</p>
                  </div>
                  {post.date ? (
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs text-black/55 dark:border-white/10 dark:text-white/55">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                  ) : null}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
