"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const createNewChat = async () => {
    try {
      if (!user) {
        toast.error("usuario nao esta logado");
        return;
      }
      const token = await getToken();
      if (!token) {
        toast.error("Token de autenticação não encontrado");
        return;
      }

      await axios.post(
        "/api/chat/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsersChats();
    } catch (error) {
      toast.error("erro mano: ", error.message);
    }
  };

  const fetchUsersChats = async () => {
    try {
      if (!user) return null;

      const token = await getToken();

      const { data } = await axios.get("/api/chat/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        console.log("Resposta de chats", data.data);
        // console.log(data.data);
        setChats(data.data);

        if (data.data.length === 0) {
          await createNewChat();
          const newData = await axios.get("/api/chat/get", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (newData.data.success) {
            setChats(newData.data.data);
            setSelectedChat(newData.data.data[0]);
            console.log(selectedChat);
          }
        } else {
          data.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          setSelectedChat(chats[0]);
          console.log(selectedChat);
          console.log(data.data[0]);
        }
      } else {
        toast.error(`erro mano: ${data.message}`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (chats.length > 0) {
      setSelectedChat(chats[0]);
    } else {
      console.log("Nenhum chat encontrado");
    }
  }, [chats]);

  useEffect(() => {
    if (user) {
      fetchUsersChats();
      console.log("chat selecionado no useefftec", selectedChat);
    }
  }, [user]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchUsersChats,
    createNewChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
