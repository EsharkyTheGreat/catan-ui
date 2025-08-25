import Image from "next/image";

export default function Bank() {
  return (
    <div className="h-1/8 bg-yellow-200 border-b border-gray-300">
      <h3 className="font-bold text-lg">Bank</h3>
      <div className="flex flex-row">
        <div className="transition-transform duration-200 hover:scale-110">
          <Image
            className=""
            src={"/ForestResourceCard.png"}
            width={80}
            height={80}
            alt="ForestResourceCard"
          />
        </div>
        <div className="transition-transform duration-200 hover:scale-110">
          <Image
            className=""
            src={"/BrickResourceCard.png"}
            width={80}
            height={80}
            alt="BrickResourceCard"
          />
        </div>
        <div className="transition-transform duration-200 hover:scale-110">
          <Image
            className=""
            src={"/WheatResourceCard.png"}
            width={80}
            height={80}
            alt="WheatResourceCard"
          />
        </div>
        <div className="transition-transform duration-200 hover:scale-110">
          <Image
            className=""
            src={"/SheepResourceCard.png"}
            width={80}
            height={80}
            alt="SheepResourceCard"
          />
        </div>
        <div className="transition-transform duration-200 hover:scale-110">
          <Image
            className=""
            src={"/StoneResourceCard.png"}
            width={80}
            height={80}
            alt="StoneResourceCard"
          />
        </div>
      </div>
    </div>
  );
}
