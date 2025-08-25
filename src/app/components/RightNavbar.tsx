import { Input } from "@/components/ui/input";
import { useGameStore } from "../store/GameState";
import { useEffect, useRef, useState } from "react";

export default function RightNavbar() {
  const { chat, addChat } = useGameStore();
  const [messageInput, setMessageInput] = useState("");

  const endMessageRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      addChat({ player: "Esharky", message: messageInput.trim() });
      setMessageInput("");
    }
  };

  useEffect(() => {
    endMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="flex flex-col h-full">
      {/* Top section - 25% */}
      <div className="h-1/4 bg-blue-200 border-b border-gray-300 flex flex-col">
        {/* Chat messages area - scrollable */}
        <div className="h-9/10 overflow-y-scroll p-4 flex flex-col">
          {chat.length === 0 ? (
            <div className="text-gray-500 text-center mt-4">
              No messages yet
            </div>
          ) : (
            chat.map((mssg, i) => (
              <div key={i} className="mb-2">
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

      {/* Second section - 25% */}
      <div className="h-1/4 bg-green-200 border-b border-gray-300">
        <div className="p-4">
          <h3 className="font-bold text-lg">Second Section</h3>
        </div>
      </div>

      {/* Third section - 12.5% */}
      <div className="h-1/8 bg-yellow-200 border-b border-gray-300">
        <div className="p-4">
          <h3 className="font-bold text-lg">Third Section</h3>
        </div>
      </div>

      {/* Fourth section - 12.5% */}
      <div className="h-1/8 bg-orange-200 border-b border-gray-300">
        <div className="p-4">
          <h3 className="font-bold text-lg">Fourth Section</h3>
        </div>
      </div>

      {/* Fifth section - 12.5% */}
      <div className="h-1/8 bg-red-200 border-b border-gray-300">
        <div className="p-4">
          <h3 className="font-bold text-lg">Fifth Section</h3>
        </div>
      </div>

      {/* Bottom section - 12.5% */}
      <div className="h-1/8 bg-purple-200">
        <div className="p-4">
          <h3 className="font-bold text-lg">Bottom Section</h3>
        </div>
      </div>
    </div>
  );
}
