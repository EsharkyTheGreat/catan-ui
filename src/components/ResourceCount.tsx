import ResourceCard from "@/components/ResourceCard";
import { useGameStore } from "@/store/GameState";

export default function ResourceCount() {
    const { playerResources } = useGameStore()

    return (
        <div className="flex gap-1 px-2 items-center h-full bg-amber-50 rounded-xl">
            <ResourceCard resourceType="TREE" count={playerResources.TREE} size={90}/>
            <ResourceCard resourceType="BRICK" count={playerResources.BRICK} size={90}/>
            <ResourceCard resourceType="WHEAT" count={playerResources.WHEAT} size={90}/>
            <ResourceCard resourceType="SHEEP" count={playerResources.SHEEP} size={90}/>
            <ResourceCard resourceType="STONE" count={playerResources.STONE} size={90}/>
        </div>
    )
}