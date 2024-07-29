import { OutputData } from "@editorjs/editorjs";

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>

export interface RoomUsers {
    id: string;
    roomId: string;
    userId: string;
    user: User;
}

export interface Room {
    id: string
    name: string
    users: RoomUsers[]
    avatar?: string
    createdAt: string;
    updatedAt: string;
    messages: Message[]
}

export interface Message {
    id: string
    text: string
    user?: User
    chatRoomId: string
    chatRoom?: Room
    userId: string;
    type: "TEXT" | "FILE"
    createdAt: string

    files?: {
        id: string;
        name: string
        size: number
        key: string
        url: string
    }[]
}

export interface UserJoinRoomProps {
    socketWithUser: {
        socket: string;
        userId: string;
    }
    chatRoomId: string;
    time: string;
}

export interface UserJoinRoomServerProps {
    userId: string;
    chatRoomId: string;
    time: string;
    users: {
        socket: string;
        userId: string;
    }[];
}

export interface userDisconnectRoomServerProps {
    socketWithUser: {
        socket: string;
        userId: string;
    }
    chatRoomId: string;
    time: string;
}

export interface AddMessageToRoomProps {
    id: string;
    type: "TEXT" | "FILE";
    text: string;
    chatRoomId: string;
    userId: string;
    createdAt: string;

    file?: {
        name: string;
        size: number;
        key: string;
        url: string;
    }[];
}

export interface AddMessageFromServerToClientProps {
    text: string;
    type: "TEXT" | "FILE";
    createdAt: string;
    id: string;
    chatRoomId: string;
    userId: string;

    file?: {
        name: string;
        size: number;
        key: string;
        url: string;
    }[];
}


export interface ServerToClientEvents {
    error: (data: { msg: string }) => void;
    userJoinRoom: (data: UserJoinRoomServerProps) => void;
    userDisconnect: (data: userDisconnectRoomServerProps) => void;
    receiveMessage: (data: AddMessageFromServerToClientProps) => void;
}

export interface ClientToServerEvents {
    clientMsg: (data: { msg: string, room: string }) => void;
    leaveRoom: (data: { room: string }) => void;
    connected: () => void;
    joinRoom: (data: UserJoinRoomProps) => void;
    message: (data: AddMessageToRoomProps) => void;
}

export type StorageFile = {
    id: string;
    name: string;
    key: string;
    size: number;
    url: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export type User = {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: string;
    image: string | null;
    password: string | null;
    role: UserRole;
}


export type Blog = {
    id?: string;
    title: string;
    content: OutputData;
    description: string;
    userId: string;
    version: number;
    seoPath: string;
}

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
}