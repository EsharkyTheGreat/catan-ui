import { useGameStore } from "@/store/GameState";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

export default function GameChat() {
  const { chat, addChat } = useGameStore();
  const [messageInput, setMessageInput] = useState("");

  const endMessageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      addChat(messageInput.trim());
      setMessageInput("");
    }
  };

  useEffect(() => {
    endMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="h-1/4 bg-blue-200 border-b border-gray-300 flex flex-col">
      {/* Chat messages area - scrollable */}
      <div className="h-9/10 overflow-y-scroll flex flex-col">
        {chat.length === 0 ? (
          <div className="text-gray-500 text-center mt-4">No messages yet</div>
        ) : (
          chat.map((mssg, i) => (
            <div key={i} className="">
              {mssg.player} {"->"} {mssg.message}
            </div>
          ))
        )}
        <div ref={endMessageRef} />
      </div>

      {/* Input at bottom */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300">
        <Input
          type="text"
          placeholder="type your message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
      </form>
    </div>
  );
}
