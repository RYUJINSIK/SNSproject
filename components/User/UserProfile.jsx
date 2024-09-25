import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProfileEditModal from "./ProfileEditModal";
import { supabase } from "@/lib/supabase";

const UserProfile = ({ profileData, posts, isOwnProfile }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(profileData);

  if (!profile) return null;

  const handlePostClick = (postId) => {
    router.push(`/posts/${postId}`);
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleSaveProfile = async (updatedProfile) => {
    try {
      let profileImageUrl = profile.profile_image_url;

      // 이미지가 변경되었다면 새로운 이미지를 업로드합니다.
      if (updatedProfile.profileImage !== profile.profile_image_url) {
        const file = dataURLtoFile(updatedProfile.profileImage, "profile.jpg");
        const filePath = `public/profileImages/${profile.username}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("ImageBucket")
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
          error: urlError,
        } = supabase.storage.from("ImageBucket").getPublicUrl(filePath);

        if (urlError) throw urlError;

        profileImageUrl = publicUrl;
      }

      // 프로필 정보 업데이트
      const { data, error } = await supabase
        .from("user")
        .update({
          username: updatedProfile.username,
          profile_message: updatedProfile.message,
          profile_image_url: profileImageUrl,
        })
        .eq("email", profile.email);

      if (error) {
        throw error;
      }

      // 로컬 상태 업데이트
      setProfile({
        ...profile,
        username: updatedProfile.username.toLowerCase(),
        profile_message: updatedProfile.message,
        profile_image_url: profileImageUrl,
      });

      setIsModalOpen(false);
      alert("프로필이 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  // Data URL을 File 객체로 변환하는 함수
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

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
                <h3 className="font-semibold text-xl mr-5">
                  {profileData.username}
                </h3>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#91684A] hover:bg-[#7D5A3C] text-white"
                    onClick={handleEditProfile}
                  >
                    프로필 수정
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-4 mb-4 text-sm">
                <div>
                  <span className="font-semibold">{posts.length}</span>{" "}
                  <span className="text-gray-500">게시물</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {profileData.followers_count}0
                  </span>{" "}
                  <span className="text-gray-500">팔로워</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {profileData.following_count}0
                  </span>{" "}
                  <span className="text-gray-500">팔로잉</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {profileData.profile_message}
                </p>
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

        <ProfileEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          profileData={profile}
          onSave={handleSaveProfile}
        />
      </div>
    </div>
  );
};

export default UserProfile;
