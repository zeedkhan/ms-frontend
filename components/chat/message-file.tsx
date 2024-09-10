import { getFile, isHTML, isImage, isPDF, isVideo } from "@/lib/utils";
import { Message } from "@/types";
import { Package } from "lucide-react";
import HTML from "../files/html";

const Video = ({ file }: { file: any }) => {
    return (
        <video
            autoPlay={false}
            src={getFile(file.url, "")}
            controls
            className="max-w-80 w-full h-full object-cover"
        />
    );
};

const OtherFile = ({ file }: { file: any }) => {
    return (
        <div
            onClick={() => {
                window.open(getFile(file, ""));
            }}
            className="flex items-center justify-center flex-col">
            <Package size={75} />

            <p className="text-xs text-center text-gray-500  w-28"><b>{file.name}</b></p>

            <p className="text-xs text-center text-gray-500 w-28">
                <b className="">
                    {(file.size / (1024 * 1024)).toFixed(2)} mb.
                </b>
            </p>

        </div>
    )
}

export const File = ({ file }: { file: any }) => {
    if (isVideo(file.url)) {
        return <Video file={file} />
    }

    if (isImage(file.url)) {
        return <img src={getFile(file.url, "")} alt={file.name} className="max-w-80 max-h-80" />
    }

    if (isPDF(file.url)) {
        return (
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" className="w-full h-full" alt="PDF" />
        )
    }

    if (isHTML(file.url)) {
        return <HTML file={file} />
    }


    return <OtherFile file={file} />
}

const MessageFile = ({
    message
}: { message: Message }) => {
    return (
        <div className="flex-1">
            {message.files?.map((file) => (
                <div key={file.id} className="cursor-pointer">
                    <File file={file} />
                </div>
            ))}
        </div>
    );
}

export default MessageFile;