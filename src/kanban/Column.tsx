// src/kanban/Column.tsx
import React from 'react'
import { Plus } from 'lucide-react'
import TaskCard from './TaskCard'
import { Task } from './utils/storage'

interface ColumnProps {
    title: string
    columnKey: Task['column_key']
    tasks: Task[]
    onAdd: (columnKey: Task['column_key']) => void
    onUpdate: (col: Task['column_key'], taskId: string, field: keyof Task, value: string) => void
    onDelete: (col: Task['column_key'], taskId: string) => void
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, fromCol: string) => void
    onDrop: (e: React.DragEvent<HTMLDivElement>, toCol: Task['column_key']) => void
}

const Column: React.FC<ColumnProps> = ({
    title,
    columnKey,
    tasks,
    onAdd,
    onUpdate,
    onDelete,
    onDragStart,
    onDrop,
}) => {
    return (
        <div
            className="flex flex-col rounded-xl bg-transparent p-2 space-y-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, columnKey)}
        >
            <div className="flex items-center justify-between px-2">
                <div className="text-sm font-semibold">{title}</div>
                <button
                    onClick={() => onAdd(columnKey)}
                    className="text-muted-foreground flex items-center gap-1 hover:text-white text-xs"
                >
                    <Plus size={14} /> New Task
                </button>
            </div>

            <div className="flex flex-col space-y-3">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        column={columnKey}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onDragStart={onDragStart}
                    />
                ))}
            </div>
        </div>
    )
}

export default Column
