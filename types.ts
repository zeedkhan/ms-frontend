import { OutputData } from "@editorjs/editorjs";

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