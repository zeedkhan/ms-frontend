import { UPLOAD_ROUTES } from "@/routes";
import axios from "axios";

type ResponseUpload = {
    storePath?: string;
    error?: string;
}

const uploadFile = async (file: File): Promise<ResponseUpload> => {
    try {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post<{ storePath: string }>(UPLOAD_ROUTES.uploads, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return res.data;
    } catch (err) {
        console.error(err);
        return {
            error: "Error uploading file"
        }
    }
};

export { uploadFile };