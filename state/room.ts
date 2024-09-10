import { create } from 'zustand'
import { Message, Room } from '@/types';
import { createAIChatRoom, createChatRoom } from '@/db/chat';

interface ChatRoomController {
    chatRooms: Room[];
    aiChatRooms: Room[];
    setRooms: (type: "ai" | "chat", rooms: Room[]) => void;
    createRoom: (userIds: string[], roomName: string) => Promise<void>;
    createAIChatRoom: (userIds: string[], roomName: string) => Promise<Room | null>;
    updateRoom: (id: string, payload: Partial<Room>) => void;
}

const RoomStore = create<ChatRoomController>((set) => ({
    chatRooms: [],
    aiChatRooms: [],
    setRooms: (type, rooms) => {
        set((prev) => {
            if (type === "ai") {
                return { ...prev, aiChatRooms: rooms }
            } else if (type === "chat") {
                return { ...prev, chatRooms: rooms }
            }
            return prev
        })
    },
    updateRoom: (id: string, payload: Partial<Room>) => {
        set((prev) => {
            const chatRooms = prev.chatRooms.map((room) => {
                if (room.id === id) {
                    return { ...room, ...payload }
                }
                return room;
            });

            const aiChatRooms = prev.aiChatRooms.map((room) => {
                if (room.id === id) {
                    return { ...room, ...payload }
                }
                return room;
            });

            return { ...prev, chatRooms, aiChatRooms }
        })
    },
    createAIChatRoom: async (userIds, roomName) => {
        const newChatRoom = await createAIChatRoom(userIds, roomName);
        if (!newChatRoom) return null;
        set((prev) => {
            // Check if prev.rooms is an array, if not, initialize it as an empty array
            const rooms = Array.isArray(prev.aiChatRooms) ? prev.aiChatRooms : [];
            return { ...prev, aiChatRooms: [newChatRoom, ...rooms] };
        });

        return newChatRoom
    },
    createRoom: async (userIds, roomName) => {
        const newChatRoom = await createChatRoom(userIds, roomName);
        if (!newChatRoom) return;
        set((prev) => {
            // Check if prev.rooms is an array, if not, initialize it as an empty array
            const rooms = Array.isArray(prev.chatRooms) ? prev.chatRooms : [];
            return { ...prev, rooms: [newChatRoom, ...rooms] };
        });
    },
}));

export default RoomStore;