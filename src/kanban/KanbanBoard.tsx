// src/kanban/KanbanBoard.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Column from './Column'
import { Task, getStoredTasks, saveTasks } from './utils/storage'

const COLUMN_TITLES: Record<Task['column_key'], string> = {
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done',
}

const KanbanBoard: React.FC = () => {
    const [columns, setColumns] = useState<Record<Task['column_key'], Task[]>>({
        todo: [],
        inProgress: [],
        done: [],
    })

    // Load tasks from localStorage
    useEffect(() => {
        const storedTasks = getStoredTasks()
        const grouped: Record<Task['column_key'], Task[]> = { todo: [], inProgress: [], done: [] }

        storedTasks.forEach((task) => grouped[task.column_key].push(task))
        setColumns(grouped)
    }, [])

    // Save tasks to localStorage whenever columns change
    useEffect(() => {
        const allTasks = [...columns.todo, ...columns.inProgress, ...columns.done]
        saveTasks(allTasks)
    }, [columns])

    const handleNewTask = (columnKey: Task['column_key']) => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            title: '',
            description: '',
            due_date: new Date().toISOString().split('T')[0],
            column_key: columnKey,
        }
        setColumns((prev) => ({
            ...prev,
            [columnKey]: [...prev[columnKey], newTask],
        }))
    }

    const updateTaskField = (col: Task['column_key'], taskId: string, field: keyof Task, value: string) => {
        setColumns((prev) => {
            const updatedTasks = prev[col].map((t) => (t.id === taskId ? { ...t, [field]: value } : t))
            return { ...prev, [col]: updatedTasks }
        })
    }

    const deleteTask = (col: Task['column_key'], taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return
        setColumns((prev) => ({
            ...prev,
            [col]: prev[col].filter((t) => t.id !== taskId),
        }))
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, fromCol: string) => {
        e.dataTransfer.setData('taskId', taskId)
        e.dataTransfer.setData('fromCol', fromCol)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, toCol: Task['column_key']) => {
        e.preventDefault()
        const taskId = e.dataTransfer.getData('taskId')
        const fromCol = e.dataTransfer.getData('fromCol')

        if (fromCol === toCol) return

        const taskToMove = columns[fromCol as Task['column_key']].find((t) => t.id === taskId)
        if (!taskToMove) return

        setColumns((prev) => {
            const fromTasks = prev[fromCol as Task['column_key']].filter((t) => t.id !== taskId)
            const toTasks = [...prev[toCol], { ...taskToMove, column_key: toCol }]
            return { ...prev, [fromCol as Task['column_key']]: fromTasks, [toCol]: toTasks }
        })
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-black text-white min-h-screen">
            {Object.entries(columns).map(([colKey, tasks]) => (
                <Column
                    key={colKey}
                    title={COLUMN_TITLES[colKey as Task['column_key']]}
                    columnKey={colKey as Task['column_key']}
                    tasks={tasks}
                    onAdd={handleNewTask}
                    onUpdate={updateTaskField}
                    onDelete={deleteTask}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                />
            ))}
        </div>
    )
}

export default KanbanBoard
