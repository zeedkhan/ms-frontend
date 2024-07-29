import { Message } from "@/types";

const message: Message = {
    id: "1",
    text: "Hello",
    userId: "1",
    chatRoomId: "1",
    type: "TEXT",
    createdAt: "2022-01-01",
}

const mockMessages = (userId: string[]): Message[] => {
    const max = 5;

    return [...Array.from({ length: max })].map((_, idx) => {
        return {
            ...message,
            userId: userId[idx % userId.length],
            id: idx.toString(),
            text: `Hello ${idx}`,
            createdAt: new Date().toISOString(),
        }
    })
}

export {
    mockMessages
}
export default message;