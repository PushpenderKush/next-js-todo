import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TodoForm from "@/components/todo/create";
import Loader from "@/components/loader";
import { useGetTodoByIdQuery } from "../../../../store/apis/todosApi";
import withAuthLayout from "../../../components/hoc";

const UpdateTodo = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: todo, isLoading } = useGetTodoByIdQuery(id);

  if (isLoading) return <Loader />;

  return (
    <div>
      {todo?.data ? (
        <TodoForm initialData={todo?.data} />
      ) : (
        <p>Todo not found</p>
      )}
    </div>
  );
};

export default withAuthLayout(UpdateTodo);
