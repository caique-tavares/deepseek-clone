import Image from "next/image";
import React, { useState } from "react";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useAppContext } from "@/context/AppContext";
import ChatLabel from "./ChatLabel";

const Sidebar = ({ expand, setExpand }) => {
  const { openSignIn } = useClerk();
  const { user } = useAppContext();

  const [openMenu, setOpenMenu] = useState({ id: 0, open: false });

  return (
    <div
      className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all z-50 max-md:absolute max-md:h-screen
                 ${expand ? "p-4 w-64" : "md:w-20 w0 max-md:overflow-hidden"}`}
    >
      <div className="flex flex-col">
        <div
          className={`flex ${
            expand ? "flex-row gap-10" : "flex-col items-center gap-8"
          }`}
        >
          <Image
            className={expand ? "w-36" : "w-10"}
            src={expand ? "/images/logo_text.svg" : "/images/logo_icon.svg"}
            alt="Logo"
            width={50}
            height={50}
          />
          <div
            onClick={() => (expand ? setExpand(false) : setExpand(true))}
            className="group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer"
          >
            <Image
              src="/images/menu_icon.svg"
              alt="Logo"
              width={50}
              height={50}
              className="md:hidden"
            />
            <Image
              src={
                expand
                  ? "/images/sidebar_close_icon.svg"
                  : "/images/sidebar_icon.svg"
              }
              alt="Logo"
              width={28}
              height={50}
              className="hidden md:block w-7"
            />
            <div
              className={`absolute w-max ${
                expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"
              } opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none`}
            >
              {expand ? "Close Sidebar" : "Open Sidebar"}
              <div
                className={`w-3 h-3 absolute bg-black rotate-45 ${
                  expand
                    ? "left-1/2 -top-1.5 -translate-x-1/2"
                    : "left-4 -botton-1.5"
                }}`}
              ></div>
            </div>
          </div>
        </div>
        <button
          className={`mt-8 flex items-center justify-center cursor-pointer ${
            expand
              ? "bg-primary hover:opacity-90 rounded-2xl gap-2 p-2.5 w-max"
              : ""
          } `}
        >
          <Image
            src={
              expand ? "/images/chat_icon.svg" : "/images/chat_icon_dull.svg"
            }
            alt="Chat icon"
            height={expand ? 24 : 2}
            width={24}
            className="self-center text-center"
          />
          <div className="absolute w-max -top-12 -right-12 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-home">
            New Chat
            <div className="w-3 h-3 absolute bg-black rotate-45 left-4 -bottom-1.5"></div>
          </div>
          {expand && <p className="text-white text font-medium">New Chat</p>}
        </button>
        <div
          className={`mt-8 text-white/25 text-sm ${
            expand ? "block" : "hidden"
          }`}
        >
          <p className="my-1">Recents</p>
          <ChatLabel openMenu={openMenu} setOpenMenu={setOpenMenu} />
        </div>
      </div>
      <div>
        <div
          className={`flex items-center cursor-pointer group relative ${
            expand
              ? "gap-1 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10 cursor-pointer"
              : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"
          }`}
        >
          <Image
            className={expand ? "w-5" : "w-6.5 mx-auto"}
            src={
              expand ? "/images/phone_icon.svg" : "/images/phone_icon_dull.svg"
            }
            alt="phone icon"
            width={50}
            height={50}
          />
          <div
            className={`absolute -top-60 pb-8${
              !expand && "-right-40"
            } opacity-0 group-hover:opacity-100 hidden group-hover:block transition`}
          >
            <div className="relative w-max bg-black text-white text-sm p-4 rounded-lg shadow-lg">
              <Image
                src="/images/qrcode.png"
                alt="2"
                width={176}
                height={100}
              />
              <p className="">Scan to get DeepSeek App</p>
              <div
                className={`w-3 h-3 absolute bg-black rotate-45 ${
                  expand ? "right-1/2" : "left-4"
                } -bottom-1.5`}
              ></div>
            </div>
          </div>

          {expand && (
            <div className="flex items-center gap-4.5">
              <span className="ml-2">Get App</span>
              <Image alt="" src="/images/new_icon.svg" width={80} height={50} />
            </div>
          )}
        </div>
        <div
          onClick={user ? null : openSignIn}
          className={`flex items-center ${
            expand ? "hover:bg-white/10 rounded-lg" : "justify-center w-full"
          } gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}
        >
          {user ? (
            <UserButton />
          ) : (
            <Image
              src="/images/profile_icon.svg"
              alt=""
              width={28}
              height={50}
            />
          )}

          {expand && <span>My Profile</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
