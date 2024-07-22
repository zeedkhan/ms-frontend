"use client";

import { FormError } from "@/components/form-error";
import { FormSucess } from "@/components/form-sucess";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/db/upload";
import { updateUserAvatar } from "@/db/user";
import { UPLOAD_ROUTES } from "@/routes";
import axios from "axios";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type EditAvatarProps = {
    url: string;
    userId: string;
}


const EditAvatar: React.FC<EditAvatarProps> = ({ url, userId }) => {
    const [img, setImg] = useState(url);
    const inputRef = useRef<null | HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(url);
    const [file, setFile] = useState<File | null>(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!file) {
            setPreview(null)
            return
        }

        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [file]);

    const handleSelectImg = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files as FileList
        const file = files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
        }
    };

    const handleUpload = async () => {
        if (!file || !preview) {
            setError("Please select your image")
            return;
        }
        try {
            const res = await uploadFile(file);
            if (res?.storePath) {
                console.log(res.storePath)
                await updateUserAvatar({ id: userId as string, path: res.storePath })
                setSuccess("Update image successfull");
                setImg(preview)
                setPreview(null);
            }
            if (res?.error) {
                setError(res.error)
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong!")
        }
    }

    return (
        <div>
            <div className="relative flex items-center justify-center">
                <Image
                    src={preview || img}
                    width={128}
                    height={128}
                    className="border rounded-full h-[128px] w-[128px]"
                    alt="Picture of the author"
                />
                <div className="absolute top-0 translate-x-full w-fit p-1 hover:bg-gray-200 cursor-pointer border bg-white rounded-full">
                    <Pencil size={20} className="p-0.5 text-black" onClick={handleSelectImg} />
                    <input type="file" hidden ref={inputRef} onChange={handleFileChange} accept="image/*" />
                </div>
            </div>

            {preview && (
                <Button
                    onClick={handleUpload}
                    size={"sm"}
                >
                    Add img
                </Button>
            )}

            <FormError message={error} className="mt-4" />
            <FormSucess message={success} />
        </div>
    )
}

export default EditAvatar;