import { Blog } from "@/types";
import { create } from "zustand";

interface BlogController {
    setBlogs: (blogs: Blog[]) => void;
    blogs: Blog[];
    removeBlog: (id: string) => void;
};


export const BlogStore = create<BlogController>((set) => ({
    blogs: [],
    setBlogs: (blogs) => {
        set((prev) => ({ ...prev, blogs: blogs }))
    },
    removeBlog: (id) => {
        set((prev) => ({ ...prev, blogs: prev.blogs.filter((blog) => blog.id !== id) }))
    }
}));