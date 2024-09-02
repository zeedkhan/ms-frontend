import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { uploadImage } from "@/db/upload";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { AspectRatio } from "../ui/aspect-ratio";
import { getFile } from "@/lib/utils";
import { CirclePlus, CircleX } from "lucide-react";
import { EnhanceButton } from "../ui/enhance-button";


type BlogSettingProps = {
    blogId: string | null;
    ogImage: string | undefined;
    setOgImage: Dispatch<SetStateAction<string | undefined>>;

    ogType: string | undefined;
    setOgType: Dispatch<SetStateAction<string | undefined>>;

    keywords: string[];
    setKeywords: Dispatch<SetStateAction<string[]>>;

    title: string;
    setTitle: Dispatch<SetStateAction<string>>
    description: string;
    setDescription: Dispatch<SetStateAction<string>>
    seoPath: string;
    prevSeoPath: string;
    setSeoPath: Dispatch<SetStateAction<string>>
    isDuplicateSeoPath: boolean | null;
    setIsDuplicateSeoPath: Dispatch<SetStateAction<boolean | null>>
}

const BlogSetting: React.FC<BlogSettingProps> = ({
    blogId,
    ogImage,
    setOgImage,
    keywords,
    setKeywords,
    ogType,
    setOgType,
    title,
    setTitle,
    description,
    setDescription,
    seoPath,
    prevSeoPath,
    setSeoPath,
    isDuplicateSeoPath,
    setIsDuplicateSeoPath
}) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f && f.type.startsWith("image/")) {
            setFile(f);
            try {
                const response = await uploadImage(f, `blog/${blogId}`);
                console.log(response)
                if (response.storePath) {
                    setOgImage(response.storePath);
                }
            } catch (error) {
                console.error(error)
                toast.error("Failed to upload image")
            }

        } else {
            toast.error("Invalid file type");
        }
    };

    useEffect(() => {
        if (file) {
            setPreview(URL.createObjectURL(file));
        }

        return () => {
            if (file) {
                URL.revokeObjectURL(preview as string);
            }
        }
    }, [file]);

    return (
        <Card className="mt-8 py-8 h-full w-full rounded-xl">
            <CardHeader>
                <h2 className="text-2xl font-semibold">Blog Settings</h2>
            </CardHeader>
            <CardContent className="h-full w-full rounded-xl">
                <div className="h-full w-full flex flex-col space-y-4 pt-4 justify-center">

                    <div className="flex flex-col items-center space-y-2 justify-center pb-8">
                        <Label className="text-2xl font-semibold py-4">Open Graph Image</Label>
                        <div className="h-80 w-full overflow-hidden" onClick={() => fileRef.current?.click()}>
                            <input type="file" hidden id='upload-image' accept="image/*" ref={fileRef} onChange={handleFileChange} />
                            <AspectRatio ratio={16 / 9} className="h-80">
                                <div className="bg-muted rounded-xl h-full">
                                    {(ogImage || preview) ? (
                                        <img src={(preview || getFile(ogImage, "")) as string} className="h-full w-full object-cover object-top rounded-xl" alt="Blog Thumbnail" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <p className="text-2xl font-semibold">Add a thumbnail image for your blog</p>
                                        </div>
                                    )}
                                </div>
                            </AspectRatio>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Label htmlFor="title">Blog title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder="Add a description" />
                    </div>

                    {prevSeoPath !== seoPath && isDuplicateSeoPath !== null && isDuplicateSeoPath && (
                        <p className="text-red-500">Seo path already exists</p>
                    )}

                    {isDuplicateSeoPath !== null && !isDuplicateSeoPath && (
                        <p className="text-green-500">Seo path is available</p>
                    )}

                    <div className="flex flex-col space-y-4">
                        <Label htmlFor="seo-path">SEO Path</Label>
                        <Input
                            id="seo-path"
                            value={seoPath}
                            onChange={(e) => {
                                setSeoPath(e.target.value);
                                setIsDuplicateSeoPath(null);
                            }}
                            placeholder="seo-path"
                        />
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Label>Keywords</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {keywords.map((keyword, index) => (
                                <div key={index} className="flex items-center border shadow rounded-xl pr-2">
                                    <Input
                                        className="border-none shadow-none flex-1"
                                        value={keyword}
                                        onChange={(e) => {
                                            const newKeywords = [...keywords];
                                            newKeywords[index] = e.target.value;
                                            setKeywords(newKeywords);
                                        }}
                                        placeholder="Add a keyword"
                                    />
                                    <CircleX
                                        onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                                        size={24}
                                        className="cursor-pointer text-red-500"
                                    />
                                </div>
                            ))}
                        </div>
                        <EnhanceButton
                            onClick={() => setKeywords([...keywords, ""])}
                            variant={"outline"}
                            className="flex items-center space-x-3 w-40"
                            size={"sm"}
                        >
                            <p>Add row</p>
                            <CirclePlus size={18} />
                        </EnhanceButton>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <Label htmlFor="content-type">Content Type</Label>
                        <Select
                            onValueChange={(value) => setOgType(value)}
                            value={ogType}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select content type" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Content Type</SelectLabel>
                                    <SelectItem value="website">Website</SelectItem>
                                    <SelectItem value="article">Article</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
};



export default BlogSetting;