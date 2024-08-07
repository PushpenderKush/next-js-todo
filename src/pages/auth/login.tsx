/* eslint-disable @next/next/no-img-element */
import { Button, Input, Text, Title } from "rizzui";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from 'next/router';
import useUser from "@/components/hooks/useUser";
import { useLoginMutation } from "../../../store/apis/authApi";
import React from "react";

const loginSchema = z.object({
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').nonempty('Password is required'),
});

type LoginSchemaFormInput = z.infer<typeof loginSchema>;

export default function Login() {
    const [login, { isLoading }] = useLoginMutation();
    const Router = useRouter();
    const { isAuthenticated } = useUser();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemaFormInput>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<LoginSchemaFormInput> = async (data) => {
        try {
            const authData = {
                email: data.email,
                password: data.password,
            };

            const response: any = await login(authData);

            if (response?.data) {

                localStorage.setItem("accessToken", JSON.stringify(response?.data?.token));
                toast.success('Login successful');
                Router.push("/todo");
            } else {
                toast.error("Invalid Email or Password");
            }
        } catch (error) {
            toast.error('Login failed');
        }

    };

    React.useEffect(() => {
        if (isAuthenticated) {
            Router.push("/todo");
        }
    }, [isAuthenticated, Router]);

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                <img
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    className="mx-auto h-10 w-auto"
                />
                <Title as="h2" className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </Title>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Input
                            label="Email address"
                            placeholder="Enter your email"
                            {...register("email")}
                        />
                        {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>}
                    </div>

                    <div>
                        <div className="rizzui-input-root flex flex-col">
                            <label className="block">
                                <span className="rizzui-input-label block text-sm mb-1.5 font-medium">Password</span>
                                <span className="rizzui-input-container flex items-center peer w-full transition duration-200 [&amp;.is-focus]:ring-[0.8px] ring-[0.6px] [&amp;.is-hover]:border-primary [&amp;.is-focus]:border-primary [&amp;.is-focus]:ring-primary [&amp;_input::placeholder]:opacity-60 px-3.5 py-2 text-sm h-10 rounded-md border border-muted ring-muted bg-transparent" data-focus="false" data-hover="false">
                                    <input type="password" {...register("password")} placeholder="Enter your password" className="rizzui-input-field w-full border-0 bg-transparent p-0 focus:outline-none focus:ring-0 [&amp;::-ms-clear]:hidden [&amp;::-ms-reveal]:hidden [&amp;::-webkit-search-cancel-button]:hidden [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:m-0 [&amp;::-webkit-outer-spin-button]:appearance-none" name="password" />
                                </span>
                            </label>
                        </div>
                        {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>}
                    </div>

                    <div>
                        <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-500">
                            Sign in
                        </Button>
                    </div>
                </form>

                <Text className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <Link href="signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Create account
                    </Link>
                </Text>
            </div>
        </div>
    );
}
