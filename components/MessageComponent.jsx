import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";

const MessageComponent = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = useUserStore((state) => state.userData);

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel("messages")
      .on(
        "INSERT",
        { event: "*", schema: "public", table: "messages" },
        handleNewMessage
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [receiverId]);

  const fetchMessages = async () => {
    console.log("currentUser.id : ", currentUser.id);
    console.log("receiverId : ", receiverId);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
    }
  };

  const handleNewMessage = (payload) => {
    const newMessage = payload.new;
    if (
      (newMessage.sender_id === currentUser.id &&
        newMessage.receiver_id === receiverId) ||
      (newMessage.sender_id === receiverId &&
        newMessage.receiver_id === currentUser.id)
    ) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { data, error } = await supabase.from("messages").insert({
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content: newMessage,
    });

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-lg ${
              message.sender_id === currentUser.id
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="메시지를 입력하세요..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageComponent;
