import { UPLOAD_ROUTES } from "@/routes";
import axios from "axios";

export type ResponseUpload = {
    storePath?: string;
    error?: string;
    success?: string;
}

const uploadImage = async (
    file: File,
    folder: string,
    defaultRoute: string = UPLOAD_ROUTES.uploads as string
): Promise<ResponseUpload> => {
    try {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post<{ storePath: string }>(defaultRoute, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-folder": folder
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

const uploadFile = async (
    file: File,
    folder: string,
    defaultRoute: string = UPLOAD_ROUTES.uploads as string
): Promise<ResponseUpload> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post<{ storePath: string }>(defaultRoute + "/file", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "x-folder": folder
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

const sendFile = async (
    file: File,
): Promise<ResponseUpload> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post(UPLOAD_ROUTES.uploadTranscriptMemory, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
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


export { uploadImage, uploadFile, sendFile };