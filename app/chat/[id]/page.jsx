"use client";
import { useParams } from "next/navigation";
import MessageComponent from "@/components/MessageComponent";
import WithoutComponentLayout from "@/components/WithoutComponentLayout/page";

const ChatPage = () => {
  const params = useParams();
  const id = params.id;

  if (!id) return <div>Loading...</div>;

  return (
    <WithoutComponentLayout>
      <div className="container mx-auto p-4 h-screen">
        <MessageComponent receiverId={id} />
      </div>
    </WithoutComponentLayout>
  );
};

export default ChatPage;
