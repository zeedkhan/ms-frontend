"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth/types";
import { useState, useTransition } from "react";
import { User } from "@/types";
import { BadgeCheck } from "lucide-react";
import { AUTH_ROUTES } from "@/routes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserSchema } from "@/schemas";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSucess } from "@/components/form-sucess";
import { updateUser } from "@/db/user";
import VerifyEmail from "./verify-email";
import { getFile } from "@/lib/utils";
import { updateUserAvatar } from "@/db/user";
import EditAvatar from "@/components/edit-avatar";


type ContentProps = {
    session: Session
    userData: User
}

const Content: React.FC<ContentProps> = ({ session, userData }) => {
    const [error, setError] = useState<string | undefined>("");
    const [sucess, setSucess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof UpdateUserSchema>>({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            id: userData.id || "",
            name: userData.name || "",
            email: userData.email || ""
        },
    });

    const onSubmit = (values: z.infer<typeof UpdateUserSchema>) => {
        setError("");
        setSucess("");

        if (userData.email !== values.email) {
            setError("Email could not be changed!");
            return;
        }

        startTransition(() => {
            updateUser(form.getValues()).then((res) => {

                if (res.success) {
                    setSucess(res.success)
                };
                if (res.error) {
                    setError(res.error)
                }
            }).catch(() => setError("Something went wrong"))
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Edit your account</CardDescription>
            </CardHeader>

            <CardContent className="p-6">
                <EditAvatar
                    url={getFile(userData.image, "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-512.png")}
                    objectId={userData.id}
                    object="user"
                    callback={updateUserAvatar}
                />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="John Doe"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled
                                                placeholder="john.doe@example.com"
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col space-y-1.5">
                                {userData.emailVerified ? (
                                    <div className="flex items-center space-x-4">
                                        <p className="text-foreground text-xs font-bold">
                                            Account verified
                                        </p>
                                        <Card className="flex px-1 py-0.5">
                                            <BadgeCheck className="text-green-600" />
                                        </Card>
                                    </div>

                                ) : (
                                    <VerifyEmail
                                        email={userData.email as string}
                                        domain={AUTH_ROUTES.domain as string}
                                    />
                                )}
                            </div>

                        </div>
                        <FormError message={error} className="mt-4" />
                        <FormSucess message={sucess} />
                        <CardFooter className="flex justify-between p-0 pt-4">
                            <Button disabled={isPending} type="submit">Save</Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default Content;