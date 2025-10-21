import { useEffect, useState } from "react";
import { Group, Image } from "react-konva";

type Props = {
    x: number;
    y: number;
    color: "RED" | "YELLOW" | "BLUE" | "GREEN"
}

export default function SettlementIcon({x,y,color}: Props) {
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const imageMap = {
        "RED" : "/RedSettlement.png",
        "YELLOW": "/YellowSettlement.png",
        "BLUE": "/BlueSettlement.png",
        "GREEN": "/GreenSettlement.png"
    }
    useEffect(() => {
        const img = new window.Image();
        img.src = imageMap[color]
        img.onload = () => {
            setImg(img);
        }
    }, [])

    return (
        <Group>
            {img && <Image
                image={img}
                width={20}
                height={20}
                x={x}
                y={y}
                draggable
            />
            }
        </Group>

    )
}