import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { GiscusComments } from "@/components/posts/GiscusComments";
import { getAllPosts, getPostBySlug, renderBlocks } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white px-6 pb-20 pt-28 text-black dark:bg-black dark:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_28rem),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.14),transparent_26rem),radial-gradient(circle_at_bottom,rgba(236,72,153,0.12),transparent_32rem)]" />
      <article className="mx-auto w-full max-w-3xl rounded-3xl border border-black/10 bg-white/55 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/50 dark:shadow-white/5 sm:p-10">
        <Link href="/posts" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-black/60 transition hover:bg-black/5 hover:text-black dark:border-white/10 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          返回文章列表
        </Link>

        <header className="mt-8 border-b border-black/10 pb-8 dark:border-white/10">
          {post.date ? (
            <p className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs text-black/55 dark:bg-white/10 dark:text-white/55">
              <CalendarDays className="h-3.5 w-3.5" />
              {post.date}
            </p>
          ) : null}
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-8 text-black/60 dark:text-white/60">{post.description}</p>
        </header>

        <div className="markdown-body mt-8">{renderBlocks(post.content.children)}</div>
      </article>
      <GiscusComments />
    </main>
  );
}
