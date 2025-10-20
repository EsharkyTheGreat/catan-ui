import { useGameStore } from "@/store/GameState";
import ResourceCard from "./ResourceCard";

export default function Bank() {
  const { bankResources } = useGameStore()
  return (
    <div className="h-1/8 bg-yellow-200 border-b border-gray-300">
      <h3 className="font-bold text-lg">Bank</h3>
      <div className="flex flex-row">
        <ResourceCard resourceType="TREE" count={bankResources.TREE} size={90} hidden={bankResources.TREE == 0} />
        <ResourceCard resourceType="BRICK" count={bankResources.BRICK}size={90} hidden={bankResources.BRICK == 0} />
        <ResourceCard resourceType="WHEAT" count={bankResources.WHEAT} size={90} hidden={bankResources.WHEAT == 0}/>
        <ResourceCard resourceType="SHEEP" count={bankResources.SHEEP} size={90} hidden={bankResources.SHEEP == 0}/>
        <ResourceCard resourceType="STONE" count={bankResources.STONE} size={90} hidden={bankResources.STONE == 0}/>
      </div>
    </div>
  );
}
