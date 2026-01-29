import { useGameStore } from "@/store/GameState";
import ResourceCard from "./ResourceCard";

import Image from "next/image";

export default function Bank() {
  const { bankResources, developmentCardsRemaining } = useGameStore()
  return (
    <div className="h-1/8 bg-yellow-200 border-b border-gray-300">
      <h3 className="font-bold text-lg">Bank</h3>
      <div className="flex flex-row">
        <ResourceCard resourceType="TREE" count={bankResources.TREE} size={90} hidden={bankResources.TREE == 0} />
        <ResourceCard resourceType="BRICK" count={bankResources.BRICK} size={90} hidden={bankResources.BRICK == 0} />
        <ResourceCard resourceType="WHEAT" count={bankResources.WHEAT} size={90} hidden={bankResources.WHEAT == 0} />
        <ResourceCard resourceType="SHEEP" count={bankResources.SHEEP} size={90} hidden={bankResources.SHEEP == 0} />
        <ResourceCard resourceType="STONE" count={bankResources.STONE} size={90} hidden={bankResources.STONE == 0} />
        <div className={`transition-transform duration-200 hover:scale-110 relative ${developmentCardsRemaining == 0 ? "opacity-25" : ""}`}>
          <Image
            src="/DevelopmentResourceCard.png"
            width={90}
            height={90}
            alt="DevelopmentResourceCard"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[25%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {developmentCardsRemaining}
          </div>
        </div>
      </div>
    </div>
  );
}
