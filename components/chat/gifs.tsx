
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { useSocket } from "../providers/socket-provider";
import axios from "axios";

type GifsProps = {
    chatRoomId: string,
    userId: string;
}

const Gifs = ({ chatRoomId, userId }: GifsProps) => {

    const [gifs, setGifs] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    const limit = 10;
    const baseURL = `https://api.giphy.com/v1/gifs`;
    const trendingURL = `${baseURL}/trending`;
    const { socket } = useSocket();

    const [offset, setOffset] = useState(limit);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        const loadGifs = async () => {
            try {
                const res = await axios.get(`${trendingURL}?api_key=${process.env.NEXT_PUBLIC_GIPHY_API}&limit=${limit}`);

                setGifs(res.data.data);

            } catch (err) {
                console.error(err);
            }
        }

        loadGifs();

    }, [open])

    const loadMore = async () => {
        if (!open || loading) return;
        setLoading(true);
        try {
            const res = await axios.get(`${trendingURL}?api_key=${process.env.NEXT_PUBLIC_GIPHY_API}&limit=${limit}&offset=${offset}`);
            setGifs((prev) => [...prev, ...res.data.data]);
            setOffset(offset + limit)
        } catch (err) {
            toast.error("Failed to load more gifs");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleClick = (gifData: any) => {
        setOpen(false);
        if (!chatRoomId || !userId) {
            return null;
        }
        socket.emit("message", {
            chatRoomId: chatRoomId,
            userId: userId,
            type: "FILE",
            text: "",
            files: [{
                name: "",
                size: 0,
                key: gifData.images.original.url,
                url: gifData.images.original.url,

            }],
            createdAt: new Date().toISOString(),
            id: uuidv4()
        });
    }

    return (
        <>
            <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger className="font-bold ">
                    GIF
                </PopoverTrigger>
                <PopoverContent
                    onScroll={async (e) => {
                        //@ts-ignore
                        if (Math.floor(e.target.scrollHeight - e.target.scrollTop) === Math.floor(e.target.clientHeight)) {
                            await loadMore()
                        }
                    }}
                    className="h-80 w-full overflow-hidden overflow-y-auto">
                    <div
                        className="grid grid-cols-3 gap-4"
                    >
                        {gifs.map((i, key) => (
                            <img
                                id={`gif-${key}`}
                                onClick={() => handleClick(i)}
                                key={`gif-${key}`}
                                className="w-28 h-28 cursor-pointer"
                                src={i.images.original.url}
                                alt="gif"
                            />
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </>
    )
}


export default Gifs;