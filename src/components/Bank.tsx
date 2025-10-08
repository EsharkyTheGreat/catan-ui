import { useGameStore } from "@/store/GameState";
import ResourceCard from "./ResourceCard";

export default function Bank() {
  const { bankResources } = useGameStore()
  return (
    <div className="h-1/8 bg-yellow-200 border-b border-gray-300">
      <h3 className="font-bold text-lg">Bank</h3>
      <div className="flex flex-row">
        <ResourceCard resourceType="TREE" count={bankResources.TREE} />
        <ResourceCard resourceType="BRICK" count={bankResources.BRICK} />
        <ResourceCard resourceType="WHEAT" count={bankResources.WHEAT} />
        <ResourceCard resourceType="SHEEP" count={bankResources.SHEEP} />
        <ResourceCard resourceType="STONE" count={bankResources.STONE} />
      </div>
    </div>
  );
}
