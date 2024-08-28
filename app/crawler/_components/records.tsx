"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { getCMS } from "@/db/cms";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import { EnhanceButton } from "@/components/ui/enhance-button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Cat, Dog, Fish, PlusCircleIcon, Rabbit, Trash, Turtle } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import axios from "axios";
import { CMS_ROUTES } from "@/routes";


const frameworksList = [
    { value: "react", label: "React", icon: Turtle },
    { value: "angular", label: "Angular", icon: Cat },
    { value: "vue", label: "Vue", icon: Dog },
    { value: "svelte", label: "Svelte", icon: Rabbit },
    { value: "ember", label: "Ember", icon: Fish },
];


const CreateNewCMS = () => {
    const [loading, setLoading] = useState(false);
    const formSchema = z.object({
        name: z.string(),
        integrations: z.array(z.object({
            key: z.string(),
            name: z.string(),
            value: z.enum(['true', 'false']).transform((value) => value === 'true'),
        }))
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            integrations: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "integrations",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            // const test = await axios.post(CMS_ROUTES.cms, values);
            setLoading(false);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <EnhanceButton
                    variant={"outline"}
                    className="h-[32px] text-xs"
                    size={"sm"}
                >
                    New
                </EnhanceButton>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[90vw]">
                <DialogTitle>Create New CMS Record</DialogTitle>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="pt-2 space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-between items-center border rounded-md pr-2">
                                            <Input
                                                className="focus-visible:ring-0 outline-none border-none shadow-none"
                                                placeholder="Enter CMS name"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Create a new CMS record.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {fields.map((item, index) => (
                            <div key={item.id}>
                                <div className="grid grid-cols-2 md:grid-cols-4  gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`integrations.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Integration Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Google Tag Manager" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name={`integrations.${index}.key`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Integration Key</FormLabel>
                                                <FormControl>

                                                    <Input {...field} placeholder="googletagmanager" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`integrations.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem >
                                                <FormLabel>Create CMS record</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value === true ? "Yes" : "No"}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a verified email to display" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="true">Yes</SelectItem>
                                                        <SelectItem value="false">No</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex items-end space-x-2">
                                        <EnhanceButton
                                            className="rounded-full"
                                            variant="destructive"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash size={18} />
                                        </EnhanceButton>

                                        <EnhanceButton
                                            type="button"
                                            variant="ringHover"
                                            className="rounded-full"
                                            onClick={() => append({ key: "", name: "", value: false })}
                                        >
                                            <PlusCircleIcon size={18} />
                                        </EnhanceButton>
                                    </div>

                                </div>
                            </div>
                        ))}

                        <div className="pt-8">
                            <EnhanceButton
                                type="button"
                                variant="outline"
                                className="rounded-full"
                                onClick={() => append({ key: "", name: "", value: false })}
                            >
                                Add Integration
                            </EnhanceButton>

                            <EnhanceButton
                                className="rounded-full"
                                variant="outline"
                                type="submit"
                                disabled={loading}
                            >
                                Add CMS record
                            </EnhanceButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}


const Records = () => {

    const [records, setRecords] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await getCMS();
            console.log(response)
        })();
    }, []);

    const fn = (id: string): Promise<void> => {
        return new Promise((resolve) => resolve());
    }

    return (
        <DataTable
            columns={columns}
            data={[]}
            deleteFn={fn}
            extraToolbar={<CreateNewCMS />}
        />
    )
};


export default Records;