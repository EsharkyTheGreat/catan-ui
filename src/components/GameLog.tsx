import { useGameStore } from "@/store/GameState";
import { useEffect, useRef } from "react";

export default function GameLog() {
  const { gameLog } = useGameStore();
  const endMessageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    endMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [gameLog]);
  return (
    <div className="h-1/4 bg-green-200 border-b border-gray-300 flex flex-col">
      {/* Chat messages area - scrollable */}
      <div className="h-full overflow-y-scroll flex flex-col">
        {gameLog.length === 0 ? (
          <div className="text-gray-500 text-center mt-4">No messages yet</div>
        ) : (
          gameLog.map((mssg, i) => (
            <div key={i} className="mb-2">
              {mssg.player} {"->"} {mssg.message}
            </div>
          ))
        )}
        <div ref={endMessageRef} />
      </div>
    </div>
  );
}
