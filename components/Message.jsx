import Image from "next/image";
import React, { useEffect } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";
import toast from "react-hot-toast";

const Message = ({ role, content }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const copyMessage = () => {
    navigator.clipboard.writeText(content);
    toast.success("Message successfully copy");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl text-sm">
      <div
        className={`flex flex-col w-full mb-8 ${
          role === "user" && "items-end"
        }`}
      >
        <div
          className={`group relative flex max-w-2xl py-3 rounded-xl ${
            role === "user" ? "bg-[#414158] px-5" : "gap-3"
          }`}
        >
          <div
            className={`opacity-0 group-hover:opacity-100 absolute ${
              role === "user" ? "-left-16 top-2.5" : "left-9 -bottom-6"
            } transition-all`}
          >
            <div className="flex items-center gap-2 opacity-70">
              {role === "user" ? (
                <>
                  <Image
                    onClick={copyMessage}
                    src="/images/copy_icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="cursor-pointer"
                  />
                  <Image
                    src="/images/pencil_icon.svg"
                    alt=""
                    width={18}
                    height={16}
                    className="cursor-pointer"
                  />
                </>
              ) : (
                <>
                  <Image
                    onClick={copyMessage}
                    src="/images/copy_icon.svg"
                    alt=""
                    width={18}
                    height={16}
                  />
                  <Image
                    src="/images/regenerate_icon.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                  <Image
                    src="/images/like_icon.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                  <Image
                    src="/images/dislike_icon.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                </>
              )}
            </div>
          </div>
          {role === "user" ? (
            <span className="text-white/90">{content}</span>
          ) : (
            <>
              <Image
                src="/images/logo_icon.png"
                alt=""
                width={36}
                height={36}
                className="p-1 border border-white/15 rounded-full self-start"
              />
              <div className="space-y-4 w-full ">
                <Markdown>{content}</Markdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
