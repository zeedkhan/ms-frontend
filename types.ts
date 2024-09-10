import { OutputData } from "@editorjs/editorjs";
import { Message as AIChatMessage } from "ai"


// If enabled the include_images_description is true, the images will be an array of { url: string, description: string }
// Otherwise, the images will be an array of strings
export type SearchResultImage = {
    url: string
    description: string
    number_of_results?: number
}

export type SearchResultItem = {
    title: string
    url: string
    content: string
}

export type SearchResults = {
    images: SearchResultImage[]
    results: SearchResultItem[]
    number_of_results?: number
    query: string
}

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
    messages: Message[] | AIChatMessage[]
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

export type Directory = {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    parentId?: string;
    children?: Directory[];
    files?: StorageFile[];
}

export type Blog = {
    id?: string;
    title: string;
    content: OutputData;
    description: string;
    userId: string;
    version: number;
    seoPath: string;

    ogImage?: string;
    ogUrl?: string;
    ogType?: string;
    keywords?: string[];

    createdAt?: string;
    updatedAt?: string;
    pageViews?: number;
}

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
}

export type SearchResult = {
    name: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    id: string
}

export type integrationType = {
    id: number;
    key: string;
    name: string;
    cmsIntegrations: CMSIntegrations[]
}

export type CMSIntegrations = {
    id: number;
    cmsId: number;
    cms: CMS;
    integrationTypeId: number
    integrationType: integrationType
    value: boolean;
}

export type CMS = {
    id: number;
    name: string;
    integrations: CMSIntegrations[]
}