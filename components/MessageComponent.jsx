import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUserStore";

const MessageComponent = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = useUserStore((state) => state.userData);
  const messagesEndRef = useRef(null);

  // 메시지 불러오는 함수
  const fetchMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUser.sub},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentUser.sub})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
    }
  }, [currentUser.sub, receiverId]);

  // 실시간 메시지 구독 설정
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          condition: `sender_id=eq.${currentUser.sub} AND receiver_id=eq.${receiverId} OR sender_id=eq.${receiverId} AND receiver_id=eq.${currentUser.sub}`,
        },
        (payload) => {
          console.log("New message received:", payload);

          // 중복된 메시지 확인 후 추가
          setMessages((prevMessages) => {
            if (!prevMessages.some((msg) => msg.id === payload.new.id)) {
              return [...prevMessages, payload.new];
            }
            return prevMessages;
          });
        }
      )
      .subscribe((status, err) => {
        console.log("Subscription status:", status);
        if (err) console.error("Subscription error:", err);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.sub, receiverId, fetchMessages]);

  // 메시지 창 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송 처리
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMessageObj = {
      sender_id: currentUser.sub,
      receiver_id: receiverId,
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    setNewMessage("");

    // Supabase에 메시지 저장 (UI에서 즉시 추가하지 않음)
    const { data, error } = await supabase
      .from("messages")
      .insert(newMessageObj)
      .select();

    if (error) {
      console.error("Error sending message:", error);
    } else {
      // 저장된 메시지만 UI에 추가
      setMessages((prevMessages) => [...prevMessages, data[0]]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`p-2 rounded-lg ${
              message.sender_id === currentUser.sub
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
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
