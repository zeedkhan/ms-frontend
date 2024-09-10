import { Card, CardContent, CardTitle } from "@/components/ui/card"
import UseWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils"
import { SearchResultImage } from "@/types"
import { PlusCircle } from "lucide-react";
import { useEffect, useRef } from "react";

export const SearchImages: React.FC<{ images: SearchResultImage[] }> = ({ images }) => {
    const showImages = useRef(images.slice(0, 2));
    const { isDesktop, isMobile, isTablet } = UseWindowSize();
    useEffect(() => {
        if (isDesktop) {
            showImages.current = images.slice(0, 4);
        } else if (isTablet) {
            showImages.current = images.slice(0, 3);
        } else if (isMobile) {
            showImages.current = images.slice(0, 2);
        }
    }, [isDesktop, isMobile, isTablet])
    return (
        <Card className="w-full">
            <CardContent
                className="p-4 w-full"
            >
                <CardTitle className="pb-3">Images</CardTitle>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 max-w-2xl">
                    {showImages.current.map((image, index) => (
                        <div key={index} className="w-40 h-28 border overflow-hidden rounded-xl relative">
                            <img
                                alt={image.description}
                                src={image.url}
                                className={cn(
                                    "w-40 h-28",
                                )}
                            />
                            {index === showImages.current.length - 1 && images.length > index && (
                                <div className="absolute w-full h-full inset-0 bg-muted/80 flex items-center justify-center">
                                    <PlusCircle size={48} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </CardContent>
        </Card>
    )
};