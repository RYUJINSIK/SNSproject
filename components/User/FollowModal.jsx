import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FollowModal = ({ isOpen, onClose, users, title }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user.profile_image_url} alt={user.username} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowModal;
