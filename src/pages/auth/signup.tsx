/* eslint-disable @next/next/no-img-element */
import { Button, Input, Text, Title } from "rizzui";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { useLogoutMutation } from "../../../store/apis/authApi";
import { useRouter } from "next/router";
import useUser from "@/components/hooks/useUser";
import { useEffect } from "react";

const signUpSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    userName: z.string().min(3, 'User Name is required'),
    mobileNo: z.string().min(10, 'Mobile no. must have 10 numbers').max(15, 'Mobile no. is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Confrim Passwords don't match",
    path: ["confirmPassword"],
});

type SignUpSchemaFormInput = z.infer<typeof signUpSchema>;

export default function Login() {
    const [signup, { isLoading }] = useLogoutMutation();
    const Router = useRouter();
    const { isAuthenticated } = useUser();


    const { register, handleSubmit, formState: { errors } } = useForm<SignUpSchemaFormInput>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<SignUpSchemaFormInput> = async (data) => {
        try {
            const authData = {
                email: data.email,
                password: data.password,
                userName: data.userName,
                mobile: data.mobileNo,
                confirmPassword: data.confirmPassword
            };

            const response: any = await signup(authData);

            if (response.data) {
                localStorage.setItem("accessToken", JSON.stringify(response.data.token));
                toast.success('Signup successful');
                Router.push("/todo")
            } else {
                toast.error("Error Creating user");
            }
        } catch (error) {
            toast.error('signup failed');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            console.log('sdasd', isAuthenticated)
            Router.push("/dashboard");
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
                            label="User Name"
                            placeholder="Enter your name"
                            {...register("userName")}
                        />
                        {errors.userName && <Text className="text-red-500 text-sm mt-1">{errors.userName.message}</Text>}
                    </div>
                    <div>
                        <Input
                            label="Mobile No."
                            placeholder="Enter your mobile no."
                            type="number"
                            {...register("mobileNo")}
                            pattern="\d*"
                        />
                        {errors.mobileNo && <Text className="text-red-500 text-sm mt-1">{errors.mobileNo.message}</Text>}
                    </div>
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
                        <div className="rizzui-input-root flex flex-col">
                            <label className="block">
                                <span className="rizzui-input-label block text-sm mb-1.5 font-medium">Confirm Password</span>
                                <span className="rizzui-input-container flex items-center peer w-full transition duration-200 [&amp;.is-focus]:ring-[0.8px] ring-[0.6px] [&amp;.is-hover]:border-primary [&amp;.is-focus]:border-primary [&amp;.is-focus]:ring-primary [&amp;_input::placeholder]:opacity-60 px-3.5 py-2 text-sm h-10 rounded-md border border-muted ring-muted bg-transparent" data-focus="false" data-hover="false">
                                    <input type="password" {...register("confirmPassword")} placeholder="Enter your password" className="rizzui-input-field w-full border-0 bg-transparent p-0 focus:outline-none focus:ring-0 [&amp;::-ms-clear]:hidden [&amp;::-ms-reveal]:hidden [&amp;::-webkit-search-cancel-button]:hidden [&amp;::-webkit-inner-spin-button]:m-0 [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:m-0 [&amp;::-webkit-outer-spin-button]:appearance-none" name="confirmPassword" />
                                </span>
                            </label>
                        </div>
                        {errors.confirmPassword && <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</Text>}
                    </div>


                    <div>
                        <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-500">
                            Sign Up
                        </Button>
                    </div>
                </form>

                <Text className="mt-10 text-center text-sm text-gray-500">
                    Already a member?{' '}
                    <Link href="login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Login account
                    </Link>
                </Text>
            </div>
        </div>
    );
}
