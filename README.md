# Next.js NextAuth Project

Welcome to the Next.js NextAuth project! This project showcases the implementation of micro service authentication

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js: [Download and install Node.js](https://nodejs.org/)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone git@github.com:xxxx

2. **Change into the project directory:**

    ```bash
    cd xxxx

3. **Install dependencies:**

    ```bash
    npm install

4. **Set up environment variables in .env file at root directory:**

    ```bash
    NEXTAUTH_URL=http://localhost:3000
    NEXT_PUBLIC_DOMAIN=http://localhost:3000
    AUTH_SECRET="somethingsecret"
    NEXT_PUBLIC_USER_SERVICE="http://localhost:8002"

5. **Run the development server:**

    ```bash
    npm run dev

6. **Open your browser and navigate to http://localhost:3000 to view the project.**


## Tech Stack

- **Next.js 14**: The foundation for building React applications with server-side rendering and more.
- **Tailwind CSS**: A utility-first CSS framework for building modern designs.
- **Shadcn UI**: A UI component library for Next.js.

## Key Features

## Key Features

- 🔐 **Authentication:**
  - Next-auth v5 (Auth.js)
  - Credentials Provider

- 🔒 **Security:**
  - Forgot password functionality
  - Email verification

- 👥 **User Management:**
  - User roles (Admin & User)
  - Flexible login (Redirect or Modal)
  - Register, Forgot Password, Verification components

- 🧩 **Components & Utilities:**
  - Reusable Login and Logout buttons
  - Role Gate for access control
  - Middleware, session, and callback exploration
  - Hooks: useCurrentUser, useRole
  - Utilities: currentUser, currentRole

Feel free to explore each feature and adapt the project to suit your specific needs. Happy coding!

## Live Demo

The application is deployed on [here](xxxxxxx).

## Author

- Tanakit Patan
- zeedkhan.tp@gmail.com