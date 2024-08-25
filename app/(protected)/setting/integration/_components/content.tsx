"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useStore } from "zustand"
import { usePlayerSpeechToggle } from "@/hooks/use-player-toggle"

const FormSchema = z.object({
    reader: z.boolean().default(false).optional(),
})

export function Content() {
    const sidebar = useStore(usePlayerSpeechToggle, (state) => state);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            reader: sidebar.on,
        },
    });



    function onSubmit(data: z.infer<typeof FormSchema>) {
        sidebar.setOn();
        console.log("speechPlayerState", sidebar.on);
        toast.success("Preferences updated")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div>
                    <h3 className="mb-4 text-lg font-medium">Integrations</h3>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="reader"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Player Reader
                                        </FormLabel>
                                        <FormDescription>
                                            Text to Speech on pages with player
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
