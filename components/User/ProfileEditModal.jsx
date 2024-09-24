import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

const ProfileEditModal = ({ isOpen, onClose, profileData, onSave }) => {
  const [username, setUsername] = useState(profileData.username);
  const [message, setMessage] = useState(profileData.profile_message);
  const [profileImage, setProfileImage] = useState(
    profileData.profile_image_url
  );
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (username !== profileData.username) {
      checkUsernameAvailability();
    } else {
      setIsUsernameAvailable(true);
    }
  }, [username]);

  const checkUsernameAvailability = async () => {
    if (username === profileData.username) return;

    setIsChecking(true);
    const { data, error } = await supabase
      .from("user")
      .select("username")
      .eq("username", username)
      .neq("email", profileData.email)
      .single();

    setIsUsernameAvailable(!data);
    setIsChecking(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (isUsernameAvailable) {
      onSave({ username, message, profileImage });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Avatar
              className="w-24 h-24 cursor-pointer"
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
            >
              <AvatarImage src={profileImage} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right">
              닉네임
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          {/* {isChecking && (
            <p className="text-sm text-gray-500">닉네임 확인 중...</p>
          )} */}
          {!isChecking && !isUsernameAvailable && (
            <p className="text-sm text-red-500">이미 사용 중인 닉네임입니다.</p>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="profileMessage" className="text-right">
              소개글
            </label>
            <Textarea
              id="profileMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            취소
          </Button>
          <Button onClick={handleSave} disabled={!isUsernameAvailable}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
