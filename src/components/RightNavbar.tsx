import GameChat from "./GameChat";
import GameLog from "./GameLog";

export default function RightNavbar() {
  return (
    <div className="flex flex-col h-full">
      {/* Top section - Game Chat - 25% */}
      <GameChat />
      {/* Second section - Game Log - 25% */}
      <GameLog />

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
