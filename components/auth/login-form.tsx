"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CardWrapper from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSucess } from "@/components/form-sucess";

import { login } from "@/actions/login";
import { Input } from "../ui/input";

const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different Provider!"
      : "";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl).then((data) => {
        console.log(data)
        if (data.error) {
          setError(data.error || "Something went wrong!")
        }
        if (data?.success) {
          setSuccess(data?.success);
        }
        form.reset();
      }).catch(() => setError("Something went wrong!"))
    })
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full">
          <div className="space-y-4">
            <>
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
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href="/auth/reset">Forgot password?</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          </div>
          <FormError message={error || urlError} />
          <FormSucess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            {"Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
