"use client";
import { useParams } from "next/navigation";
import MessageComponent from "@/components/MessageComponent";

const ChatPage = () => {
  const params = useParams();
  const id = params.id;

  if (!id) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <MessageComponent receiverId={id} />
    </div>
  );
};

export default ChatPage;
