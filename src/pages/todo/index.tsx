import Link from 'next/link';
import React, { useState, useEffect, useCallback } from 'react';
import withAuthLayout from '@/components/hoc';
import { Badge, Button, Table } from 'rizzui';
import { useGetTodosQuery, useDeleteTodoMutation, useUpdateTodoStatusMutation } from '../../../store/apis/todosApi';
import Loader from '@/components/loader';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/confirmationModal';

interface Todo {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
}

const Page: React.FC = () => {
    const { data, isLoading, refetch } = useGetTodosQuery({});
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [deleteTodo] = useDeleteTodoMutation();
    const [updateTodoStatus] = useUpdateTodoStatusMutation();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState<number | null>(null);
    const [todoToComplete, setTodoToComplete] = useState<Todo | null>(null);

    useEffect(() => {
        if (!isLoading && data?.data && data.data.length > 0) {
            setTodoList(data.data);
        }
    }, [data, isLoading]);

    const handleDelete = async () => {
        if (todoToDelete !== null) {
            try {
                await deleteTodo(todoToDelete).unwrap();
                setTodoList(todoList.filter(todo => todo.id !== todoToDelete));
                toast.success("Todo deleted successfully.");
            } catch (error) {
                toast.error("Failed to delete todo.");
            } finally {
                setIsDeleteModalOpen(false);
                setTodoToDelete(null);
            }
        }
    };

    const handleSetComplete = async () => {
        if (todoToComplete !== null) {
            try {
                await updateTodoStatus({ id: todoToComplete.id, selectedTodo: { ...todoToComplete, isCompleted: !todoToComplete.isCompleted } }).unwrap();
                setTodoList(todoList.map(todo =>
                    todo.id === todoToComplete.id ? { ...todo, isCompleted: !todo.isCompleted } : todo
                ));
                toast.success(`Todo marked as ${todoToComplete.isCompleted ? "pending" : "complete"}.`);
            } catch (error) {
                toast.error("Failed to update todo status.");
            } finally {
                setIsCompleteModalOpen(false);
                setTodoToComplete(null);
            }
        }
    };

    const openDeleteConfirmationModal = useCallback((id: number) => {
        setTodoToDelete(id);
        setIsDeleteModalOpen(true);
    }, []);

    const openCompleteConfirmationModal = useCallback((todo: Todo) => {
        setTodoToComplete(todo);
        setIsCompleteModalOpen(true);
    }, []);

    React.useEffect(() => {
        refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='w-full max-w-7xl lg:ml-8'>
            <div className='flex justify-between items-center mb-8'>
                <h2 className="text-3xl font-bold tracking-tight text-blue-700">To Do List</h2>
                <Link href='/todo/create' className='bg-blue-700 text-white rounded'>
                    <Button className='rounded'>Add Todos</Button>
                </Link>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className='overflow-x-auto'>
                    <Table className='w-full'>
                        <Table.Header>
                            <Table.Row>
                                <Table.Head>ID</Table.Head>
                                <Table.Head>Title</Table.Head>
                                <Table.Head>Description</Table.Head>
                                <Table.Head>Status</Table.Head>
                                <Table.Head>Action</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {todoList && todoList.length > 0 && todoList.map((item, index) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{item.title}</Table.Cell>
                                    <Table.Cell>{item.description}</Table.Cell>
                                    <Table.Cell>
                                        <Badge className='bg-blue-700 text-white'>{item.isCompleted ? "Completed" : 'Pending'}</Badge>
                                    </Table.Cell>
                                    <Table.Cell >
                                        <div className='flex gap-4'>
                                            <Button className='bg-red-600 text-black' onClick={() => openDeleteConfirmationModal(item.id)}>Delete</Button>
                                            <Link href={`/todo/${item.id}`}>
                                                <Button className='bg-blue-700 text-white'>Edit</Button>
                                            </Link>
                                            <Button className='text-white' onClick={() => openCompleteConfirmationModal(item)}>
                                                {item.isCompleted ? 'Mark as Pending' : 'Mark as Complete'}
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this todo?"
            />

            <ConfirmationModal
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                onConfirm={handleSetComplete}
                message={`Are you sure you want to mark this todo as ${todoToComplete?.isCompleted ? "pending" : "complete"}?`}
            />
        </div>
    );
};

export default withAuthLayout(Page);
