import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const UserProfile = ({ profileData, posts, isOwnProfile }) => {
  if (!profileData) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <Image
                src={profileData.avatar_url || "/default-avatar.png"}
                alt={profileData.username}
                width={96}
                height={96}
              />
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profileData.username}</h1>
              <p className="text-gray-600">{profileData.bio}</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-4">
            <div>
              <span className="font-bold">{profileData.followers_count}</span>{" "}
              팔로워
            </div>
            <div>
              <span className="font-bold">{profileData.following_count}</span>{" "}
              팔로잉
            </div>
          </div>
          {isOwnProfile && (
            <Button className="mt-4" variant="outline">
              프로필 수정
            </Button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">게시물</h2>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="aspect-square relative overflow-hidden rounded-lg"
          >
            <Image
              src={post.thumbnail_url}
              alt="Post thumbnail"
              layout="fill"
              objectFit="cover"
              className="hover:opacity-75 transition-opacity"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
