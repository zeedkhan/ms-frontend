import { AUTH_ROUTES } from "@/routes";
import axios from "axios";

const createResetToken = async (email: string) => {
    const response = await axios.post(`${AUTH_ROUTES.changePassword}`, { email, domain: process.env.NEXT_PUBLIC_DOMAIN });
    console.log(response.data)

    return response.data
}


export {
    createResetToken
}