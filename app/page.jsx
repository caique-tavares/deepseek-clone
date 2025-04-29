"use client";

import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChat } = useAppContext();
  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar setExpand={setExpand} expand={expand} />
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180"
              src="/images/menu_icon.svg"
              alt="icone do menu"
              width={30}
              height={30}
            />
            <Image
              className="opacity-70"
              src="/images/chat_icon.svg"
              alt="icone do menu"
              width={30}
              height={30}
            />
          </div>
          {messages.length === 0 ? (
            <>
              <div className="flex flex-col items-center ">
                <Image
                  src="/images/logo_icon.svg"
                  alt=""
                  width={64}
                  height={64}
                  className="h-16"
                />
                <p className="text-2xl font-medium">Hi, I'm DeepSeek.</p>
              </div>
              <p className="text-sm mt-2">How can i help you today?</p>
            </>
          ) : (
            <div ref={containerRef}>
              {
                // messages.map(()=> (
                // ))
              }
              <Message role="user" content="What is next js?" />
            </div>
          )}
          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
          <p className="text-xs absolute bottom-1 text-gray-500">
            AI-generated, for reference only
          </p>
        </div>
      </div>
    </div>
  );
}
