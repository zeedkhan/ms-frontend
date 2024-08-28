import { CMS_ROUTES } from "@/routes";
import { CMS } from "@/types";
import axios from "axios";

export const getCMS = async () => {
    try {
        const response = await axios.get<{ cms: CMS[] }>(`${CMS_ROUTES.cms}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};