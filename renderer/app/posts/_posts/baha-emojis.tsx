import Image from "next/image";
import { useState } from "react";

export default function BahaEmojis({ insertEmoji }: { insertEmoji: Function }) {
  const [isShow, setIsShow] = useState(false);

  return (
    <div className="relative">
      <button
        aria-label="open-emojis"
        className="icon-[mdi--emoji-outline] align-middle text-3xl text-gray-500"
        onMouseOver={() => setIsShow(true)}
      ></button>
      {isShow && (
        <div
          className="absolute right-0 top-8 z-10 flex w-80 flex-wrap justify-around gap-2 rounded border bg-white p-2 shadow-lg"
          data-testid="emojis"
          onMouseLeave={() => setIsShow(false)}
        >
          {[...Array(43)].map((_val, idx) => (
            <Image
              alt={`${idx + 1}.gif`}
              className="max-w-none cursor-pointer"
              height={19}
              key={idx}
              src={`https://i2.bahamut.com.tw/editor/emotion/${idx + 1}.gif`}
              width={19}
              unoptimized={true}
              onClick={() =>
                insertEmoji(
                  `https://i2.bahamut.com.tw/editor/emotion/${idx + 1}.gif`,
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
