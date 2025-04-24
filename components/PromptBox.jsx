"use client";

import Image from "next/image";
import React, { useState } from "react";

const PromptBox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompot] = useState("");

  return (
    <form
      className={`w-full ${
        false ? "max-w-3xl" : "max-w-2xl"
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
        rows={2}
        placeholder="Message DeepSeek"
        required
        onChange={(e) => setPrompot(e.target.value)}
        value={prompt}
      />
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image
              src="/images/deepthink_icon.svg"
              alt=""
              width={20}
              height={50}
            />
            DeepThink (R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image
              src="/images/search_icon.svg"
              alt=""
              width={20}
              height={50}
            />
            Search
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/images/pin_icon.svg"
            alt=""
            width={16}
            height={50}
            className="cursor-pointer"
          />
          <button
            className={`${
              prompt ? "bg-primary cursor-pointer" : "bg-[#71717a]"
            } rounded-full p-2 `}
          >
            <Image
              src={
                prompt
                  ? "/images/arrow_icon.svg"
                  : "/images/arrow_icon_dull.svg"
              }
              alt=""
              width={16}
              height={50}
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
