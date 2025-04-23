import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import notFound from "@/app/profile/[username]/not-found";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const user = await getProfileByUsername(params.username);

  if (!user) return;
  const metaTitle = `${user.name?.trim() ? user.name : user.username}`;

  return {
    title: `${metaTitle} | Stride`,
    description:
      user.bio || `Check out ${user.name ?? user.username}'s profile`,
  };
}

async function ProfilePage({ params }: { params: { username: string } }) {
  console.log(params);

  const user = await getProfileByUsername(params.username);

  if (!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}

export default ProfilePage;
