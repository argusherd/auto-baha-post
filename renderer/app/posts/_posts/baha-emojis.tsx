import Image from "next/image";

export default function BahaEmojis({ insertEmoji }: { insertEmoji: Function }) {
  return (
    <div className="flex flex-wrap">
      {[...Array(43)].map((_val, idx) => (
        <Image
          alt={`${idx + 1}.gif`}
          key={idx}
          height={19}
          src={`https://i2.bahamut.com.tw/editor/emotion/${idx + 1}.gif`}
          width={19}
          unoptimized={true}
          onClick={() =>
            insertEmoji(
              `https://i2.bahamut.com.tw/editor/emotion/${idx + 1}.gif`
            )
          }
        />
      ))}
    </div>
  );
}
