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
    mobileNo: z.string().min(10, 'Mobile no. is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required')
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
                            {...register("mobileNo")}
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
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password")}
                        />
                        {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>}
                    </div>
                    <div>
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            {...register("confirmPassword")}
                        />
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
                    <Link href="signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Login account
                    </Link>
                </Text>
            </div>
        </div>
    );
}
