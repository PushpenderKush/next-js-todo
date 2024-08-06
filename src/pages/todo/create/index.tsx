import withAuthLayout from '@/components/hoc'
import TodoForm from '@/components/todo/create'
import React from 'react'

const TodoTable = () => {
    return (
        <TodoForm />
    )
}

export default withAuthLayout(TodoTable)