import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // useRouter import
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const UserProfile = ({ profileData, posts, isOwnProfile }) => {
  const router = useRouter();

  if (!profileData) return null;

  const handlePostClick = (postId) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-2 border-gray-200">
              <AvatarImage
                src={profileData.profile_image_url}
                alt={profileData.username}
              />
              <AvatarFallback>{profileData.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-xl mr-5 ">
                  {profileData.username}
                </h3>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    className=" bg-[#91684A] hover:bg-[#7D5A3C] text-white"
                  >
                    프로필 수정
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{profileData.bio}</p>
              <div className="flex justify-between text-sm max-w-xs">
                <div className="text-center">
                  <span className="text-gray-500">팔로워</span>
                  <span className="font-semibold block">
                    {profileData.followers_count}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-gray-500">팔로잉</span>
                  <span className="font-semibold block">
                    {profileData.following_count}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-gray-500">게시물</span>
                  <span className="font-semibold block">{posts.length}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <h2 className="text-xl font-semibold mb-4">게시물</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="aspect-square relative overflow-hidden rounded-md shadow-sm transition-transform hover:scale-102 cursor-pointer"
            onClick={() => handlePostClick(post.id)}
          >
            <Image
              src={post.image_urls[0]}
              alt="Post thumbnail"
              layout="fill"
              objectFit="cover"
              className="hover:opacity-90 transition-opacity duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
