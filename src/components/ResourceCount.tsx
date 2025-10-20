import ResourceCard from "@/components/ResourceCard";
import { useGameStore } from "@/store/GameState";

export default function ResourceCount() {
    const { playerResources } = useGameStore()

    return (
        <div className="flex gap-1 px-2 items-center h-full bg-amber-50 rounded-xl">
            <ResourceCard resourceType="TREE" count={playerResources.TREE} size={90} hidden={playerResources.TREE == 0}/>
            <ResourceCard resourceType="BRICK" count={playerResources.BRICK} size={90} hidden={playerResources.BRICK == 0}/>
            <ResourceCard resourceType="WHEAT" count={playerResources.WHEAT} size={90} hidden={playerResources.WHEAT == 0}/>
            <ResourceCard resourceType="SHEEP" count={playerResources.SHEEP} size={90} hidden={playerResources.SHEEP == 0}/>
            <ResourceCard resourceType="STONE" count={playerResources.STONE} size={90} hidden={playerResources.STONE == 0}/>
        </div>
    )
}