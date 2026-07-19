import { PostsList } from "@/components/posts/PostsList";
import { getAllPosts } from "@/lib/posts";

export default function PostsPage() {
  return <PostsList posts={getAllPosts()} />;
}
