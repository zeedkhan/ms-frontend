/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

export const blogRoutes = /^\/blog\/[a-zA-Z0-9-]+(?:\?.*)?$/;

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication puposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";


/**
 * Auth Service
 * @type {[x:string]: string}
 */
export const AUTH_ROUTES = {
  domain: process.env.NEXT_PUBLIC_DOMAIN,
  register: process.env.NEXT_PUBLIC_GATEWAY + "/user",
  singIn: process.env.NEXT_PUBLIC_GATEWAY + "/user/signIn",
  user: process.env.NEXT_PUBLIC_GATEWAY + "/user",
  changePassword: process.env.NEXT_PUBLIC_GATEWAY + "/reset/pwd",
  verifyEmail: process.env.NEXT_PUBLIC_GATEWAY + "/token",
};

export const UPLOAD_ROUTES = {
  stroageDomain: process.env.NEXT_PUBLIC_STORAGE,
  uploads: process.env.NEXT_PUBLIC_UPLOAD + "/upload",
  userStorage: process.env.NEXT_PUBLIC_GATEWAY + "/user/storage",
  getFileId: process.env.NEXT_PUBLIC_GATEWAY + "/user/storage/file",
  editUserAvatar: process.env.NEXT_PUBLIC_GATEWAY + "/user/avatar",
  uploadTranscript: process.env.NEXT_PUBLIC_UPLOAD + "/transcription",
}

export const BLOG_ROUTES = {
  blog: process.env.NEXT_PUBLIC_GATEWAY + "/blog",
  seoPathCheck: process.env.NEXT_PUBLIC_GATEWAY + "/blog/path"
}

export const CHAT_ROUTES = {
  userChats: process.env.NEXT_PUBLIC_GATEWAY + "/chat/user",
  editChatAvatar: process.env.NEXT_PUBLIC_GATEWAY + "/chat/avatar",
  chat: process.env.NEXT_PUBLIC_GATEWAY + "/chat",
}