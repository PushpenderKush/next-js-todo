import React, { useEffect } from 'react';
import { Button, Text, Title, Textarea, Input } from 'rizzui';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useCreateTodoMutation, useUpdateTodoMutation } from '../../../store/apis/todosApi';

const todoSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(50, 'Description is required'),
});

type TodoSchemaFormInput = z.infer<typeof todoSchema>;

interface TodoFormProps {
    initialData?: {
        id: number;
        title: string;
        description: string;
        isComplete: boolean;
    };
}

const TodoForm: React.FC<TodoFormProps> = ({ initialData }) => {
    const router = useRouter();
    const [createTodo] = useCreateTodoMutation();
    const [updateTodo] = useUpdateTodoMutation();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<TodoSchemaFormInput>({
        resolver: zodResolver(todoSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (initialData) {
            setValue("title", initialData.title);
            setValue("description", initialData.description);
        }
    }, [initialData, setValue]);

    const onSubmit: SubmitHandler<TodoSchemaFormInput> = async (data) => {
        try {
            if (initialData) {
                await updateTodo({
                    id: initialData.id,
                    updatedData: {
                        title: data.title,
                        description: data.description,
                    }
                }).unwrap();
                toast.success('Todo updated successfully');
            } else {
                await createTodo({
                    title: data.title,
                    description: data.description
                }).unwrap();
                toast.success('Todo created successfully');
            }
            router.push('/todo');
        } catch (error) {
            toast.error('Error saving todo');
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Title as="h2" className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {initialData ? 'Update To-Do' : 'Add New To-Do'}
                </Title>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Input
                            label="Title"
                            placeholder="Enter the title"
                            {...register("title")}
                        />
                        {errors.title && <Text className="text-red-500 text-sm mt-1">{errors.title.message}</Text>}
                    </div>
                    <div>
                        <Textarea
                            label="Description"
                            placeholder="Enter the description"
                            {...register("description")}
                        />
                        {errors.description && <Text className="text-red-500 text-sm mt-1">{errors.description.message}</Text>}
                    </div>

                    <div>
                        <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-500">
                            {initialData ? 'Update To-Do' : 'Add To-Do'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TodoForm;
