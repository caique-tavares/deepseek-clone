"use client";

import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PromptBox = ({ isLoading, setIsLoading }) => {
  const [prompt, setPrompot] = useState("");
  const { user, chats, setChats, selectedChat, setSelectedChat } =
    useAppContext();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompot(e);
    }
  };

  const sendPrompot = async (e) => {
    const promptCopy = prompt;

    try {
      e.preventDefault();
      if (!user) return toast.error("Login to send message");

      if (isLoading)
        return toast.error("Wait for the previous prompt response");

      if (!selectedChat) {
        toast.error("No chat selected");
        return;
      }

      setIsLoading(true);
      setPrompot("");

      const userPrompt = {
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? {
                ...chat,
                messages: [...chat.messages, userPrompt],
              }
            : chat
        )
      );
      setSelectedChat((prev) => ({
        ...prev,
        messages: [...prev.messages, userPrompt],
      }));

      const { data } = await axios.post("api/chat/ai", {
        chatId: selectedChat._id,
        prompt,
      });

      console.log("dado do data", data);

      if (data.success) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, messages: [...chat.messages, data.data] }
              : chat
          )
        );
        const message = data.data.content;
        const messageTokens = message.split(" ");
        let assistantMessage = {
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };
        setSelectedChat((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));
        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1).join(" ");
            setSelectedChat((prev) => {
              const updatedMessages = [
                ...prev.messages.slice(0, -1),
                assistantMessage,
              ];
              return { ...prev, messages: updatedMessages };
            });
          }, i * 100);
        }
      } else {
        toast.error("erro mano", data.message);
        setPrompot(promptCopy);
      }
    } catch (error) {
      toast.error("erro mano: ", error.message);
      setPrompot(promptCopy);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendPrompot}
      className={`w-full ${
        selectedChat?.messages.length > 0 ? "max-w-3xl" : "max-w-2xl"
      } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
    >
      <textarea
        onKeyDown={handleKeyDown}
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
