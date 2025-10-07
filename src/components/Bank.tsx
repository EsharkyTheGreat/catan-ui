import { useGameStore } from "@/store/GameState";
import Image from "next/image";

export default function Bank() {
  const { bankResources } = useGameStore()
  return (
    <div className="h-1/8 bg-yellow-200 border-b border-gray-300">
      <h3 className="font-bold text-lg">Bank</h3>
      <div className="flex flex-row">
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={"/ForestResourceCard.png"}
            width={80}
            height={80}
            alt="ForestResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {bankResources.TREE}
          </div>
        </div>
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={"/BrickResourceCard.png"}
            width={80}
            height={80}
            alt="BrickResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {bankResources.BRICK}
          </div>
        </div>
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={"/WheatResourceCard.png"}
            width={80}
            height={80}
            alt="WheatResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {bankResources.WHEAT}
          </div>
        </div>
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={"/SheepResourceCard.png"}
            width={80}
            height={80}
            alt="SheepResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {bankResources.SHEEP}
          </div>
        </div>
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={"/StoneResourceCard.png"}
            width={80}
            height={80}
            alt="StoneResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {bankResources.STONE}
          </div>
        </div>
      </div>
    </div>
  );
}
