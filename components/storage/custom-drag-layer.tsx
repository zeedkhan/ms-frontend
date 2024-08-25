import { useMousePosition } from "@/hooks/use-mouse";
import { useDragLayer } from "react-dnd";
import { Card } from "../ui/card";

const CustomDragLayer = () => {
    const { x, y } = useMousePosition();
    const {
        itemType,
        isDragging,
        item,
        initialOffset,
        currentOffset,
    } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        isDragging: monitor.isDragging(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
    }));

    if (!isDragging || !currentOffset || !initialOffset) {
        return null;
    }

    // Calculate the offset difference between the initial and current positions
    const offsetX = currentOffset.x - initialOffset.x;
    const offsetY = currentOffset.y - initialOffset.y;

    const transform = `translate(${offsetX}px, ${offsetY}px)`;

    return (
        <div style={{ pointerEvents: 'none', position: 'fixed', top: y, left: x }}>
            <div style={{ transform }}>
                <Card className="shadow-lg p-2 rounded border">
                    {item.ids.length} {item.ids.length > 1 ? 'files' : 'file'} selected
                    <div className="flex flex-wrap mt-2">
                        {item.ids.map((id: string) => (
                            <div key={id} className="mr-2 mb-2">
                                <div className="text-xs dark:text-black bg-gray-200 flex items-center justify-center rounded">
                                    <p>{id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CustomDragLayer;