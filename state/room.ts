import { create } from 'zustand'
import { Message, Room } from '@/types';
import { createChatRoom } from '@/db/chat';

interface ChatRoomController {
    rooms: Room[];
    setRooms: (rooms: Room[]) => void;
    createRoom: (userIds: string[], roomName: string) => Promise<void>;

    currentChat: Room | null;
    setCurrentChat: (chatRoom: Room | null) => void;
}

const RoomStore = create<ChatRoomController>((set) => ({
    rooms: [],
    currentChat: null,
    setRooms: (rooms) => {
        set((prev) => ({ ...prev, rooms: rooms }))
    },
    createRoom: async (userIds, roomName) => {
        const newChatRoom = await createChatRoom(userIds, roomName);
        if (!newChatRoom) return;
        set((prev) => {
            // Check if prev.rooms is an array, if not, initialize it as an empty array
            const rooms = Array.isArray(prev.rooms) ? prev.rooms : [];
            return { ...prev, rooms: [newChatRoom, ...rooms] };
        });
    },
    setCurrentChat: (chatRoom: Room | null) => {
        set((prev) => {
            if (!chatRoom) {
                return { ...prev, currentChat: null };
            }
            const updateRooms = prev.rooms.map((room) => {
                if (room.id === chatRoom.id) {
                    return { ...room, ...chatRoom }
                }
                return room;
            });

            // sort rooms by last message
            updateRooms.sort((a,b) => {
                if (!a.messages.length) return 1;
                if (!b.messages.length) return -1;
                const lastMsg = (a.messages[a.messages.length - 1] as Message).createdAt;
                const lastMsg2 = (b.messages[b.messages.length - 1] as Message).createdAt;
                return new Date(lastMsg2).getTime() - new Date(lastMsg).getTime();
            })
            return { ...prev, rooms: updateRooms, currentChat: { ...prev.currentChat, ...chatRoom } };
        });
    }
}));

export default RoomStore;