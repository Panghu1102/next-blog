import { setRequestLocale } from "next-intl/server";
import { PostsList } from "@/components/posts/PostsList";
import { getAllPosts } from "@/lib/posts";

type PostsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PostsPage({ params }: PostsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PostsList posts={getAllPosts()} />;
}
