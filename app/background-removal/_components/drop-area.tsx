import { Card } from '@/components/ui/card'
import { CloudUpload, Mountain } from 'lucide-react'
import type { FC } from 'react'
import type { DropTargetMonitor } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'
import { EnhanceButton } from '@/components/ui/enhance-button'

export interface DropAreaProps {
    onDrop: (item: { files: any[] }) => void
    onClick: () => void
}


export const DropArea: FC<DropAreaProps> = (props) => {
    const { onDrop, onClick } = props
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: [NativeTypes.FILE],
        drop(item: { files: any[] }) {
            if (onDrop) {
                onDrop(item)
            }
        },
        canDrop(item: any) {
            console.log('canDrop', item.files, item.items)
            return true
        },
        hover(item: any) {
            console.log('hover', item.files, item.items)
        },
        collect: (monitor: DropTargetMonitor) => {
            const item = monitor.getItem() as any
            if (item) {
                console.log('collect', item.files, item.items)
            }

            return {
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }
        },
    }),
        [props],
    );

    return (
        <Card
            className={cn(
                "flex flex-col space-y-5",
                `px-8 dark:border-white rounded-md py-16`,
            )}
            ref={drop}
        >
            <div
                onClick={onClick}
                className={cn(
                    'cursor-pointer py-4 bg-muted p-2 w-full max-w-lg flex flex-col space-y-4 items-center justify-center m-auto rounded-xl shadow border dark:border-white',
                )}>

                <div className='flex items-center justify-center space-x-4 translate-y-4'>
                    <motion.div>
                        <Card className='translate-x-2 -rotate-12 bg-white dark:bg-muted dark:border-white flex items-center justify-center h-[78px] w-[48px] rounded-md'>
                            <Mountain className='text-gray-400 m-auto' />
                        </Card>
                    </motion.div>

                    <motion.div
                    >
                        <Card className='translate-x-2 -rotate-12 bg-white dark:bg-muted dark:border-white flex items-center justify-center h-[78px] w-[48px] rounded-md'>
                            <Mountain className='text-gray-400 m-auto' />
                        </Card>
                    </motion.div>

                    <motion.div
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        <Card className='-translate-y-2 translate-x-4 rotate-12 bg-white dark:bg-muted dark:border-white flex items-center justify-center h-[78px] w-[48px] rounded-md'>
                            <Mountain className='text-gray-400 m-auto' />
                        </Card>
                    </motion.div>

                    <motion.div
                    >

                        <Card className='translate-x-3 rotate-12 bg-white dark:bg-muted dark:border-white flex items-center justify-center h-[78px] w-[48px] rounded-md'>
                            <Mountain className='text-gray-400 m-auto' />
                        </Card>
                    </motion.div>

                </div>

                <div className='text-gray-600 flex flex-col items-center justify-center text-center dark:text-gray-400'>
                    <div>
                        <CloudUpload size={96} className='dark:text-gray-400 text-gray-600' />
                    </div>
                    <div>
                        {!canDrop ? (
                            <>
                                <p className='text-lg'>Drag and drop or click here</p>
                                <p className='text-sm'>to remove your image</p>
                            </>
                        ) : (
                            <p>Drop here</p>
                        )}
                    </div>
                </div>
            </div>


            <div className='text-gray-600 flex flex-col space-y-2 text-center'>
                <div className='font-bold text-2xl'>
                    <p>Remove Image</p>
                    <p>Background</p>
                </div>
                <div className='font-semibold'>
                    <p>100% Automatically and Free</p>
                </div>
            </div>
            <EnhanceButton
                variant={"gooeyLeft"}
                className='rounded-full max-w-lg mx-auto w-full text-xl bg-blue-600 hover:bg-blue-500 dark:hover:bg-foreground dark:bg-white dark:text-gray-900 text-white'
                onClick={onClick}
            >
                Upload Image
            </EnhanceButton>

            <EnhanceButton
                variant={"outline"}
                className='rounded-full max-w-lg mx-auto w-full text-xl'
                onClick={onClick}
            >
                Cloud Image
            </EnhanceButton>

            <div className='text-center text-gray-500 font-semibold text-sm flex items-center justify-center space-y-1 flex-col'>
                <small>By uploading an image or URL you agree to our Terms of Service. To learn more about how remove.bg handles your personal data, check our Privacy Policy.</small>
            </div>

        </Card>
    )
}
