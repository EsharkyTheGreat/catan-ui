import { Resource } from "@/lib/types"
import Image from "next/image"

type Props = {
    resourceType: Resource
    count: number
}

const imagePathMap: Record<Resource,string> = {
    BRICK: "/BrickResourceCard.png",
    TREE: "/ForestResourceCard.png",
    SHEEP: "/SheepResourceCard.png",
    STONE: "/StoneResourceCard.png",
    WHEAT: "/WheatResourceCard.png",
}

const altNameMap: Record<Resource,string> = {
    BRICK: "BrickResourceCard",
    TREE: "ForestResourceCard",
    SHEEP: "SheepResourceCard",
    STONE: "StoneResourceCard",
    WHEAT: "WheatResourceCard",
}

export default function ResourceCard({resourceType,count}:Props) {
    return (
        <div className="transition-transform duration-200 hover:scale-110 relative">
          <Image
            className=""
            src={imagePathMap[resourceType]}
            width={90}
            height={90}
            alt={altNameMap[resourceType]}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[75%] text-white text-[12px] font-bold drop-shadow-sm select-none">
            {count}
          </div>
        </div>
    )
}