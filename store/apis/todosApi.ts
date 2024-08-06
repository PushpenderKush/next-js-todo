import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiConfig } from "./apiConfig"; 

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({
    ...apiConfig,
  }),
 
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => ({
        url: "/todos",
        method: "GET",
      }),
    }),
    getTodoById: builder.query({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "GET",
      }),
    }),
    createTodo: builder.mutation({
      query: (todoData) => ({
        url: "/todos",
        method: "POST",
        body: todoData,
      }),
     
    }),
    updateTodo: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/todos/${id}`,
        method: "PUT",
        body: updatedData,
      }),
    
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
     
    }),
    updateTodoStatus: builder.mutation({
      query: ({ id, selectedTodo }) => ({
        url: `/todos/${id}/completion`,
        method: "PUT",
        body: selectedTodo,
      }),
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoStatusMutation,
} = todosApi;
