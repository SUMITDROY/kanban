// src/kanban/TaskCard.tsx
import React from 'react'
import { GripVertical } from 'lucide-react'
import { Task } from './utils/storage'

interface TaskCardProps {
    task: Task
    column: Task['column_key']
    onUpdate: (col: Task['column_key'], taskId: string, field: keyof Task, value: string) => void
    onDelete: (col: Task['column_key'], taskId: string) => void
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, fromCol: string) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, column, onUpdate, onDelete, onDragStart }) => {
    return (
        <div
            className="rounded-lg bg-black border border-zinc-700 p-4 shadow transition-transform active:scale-[0.98]"
            draggable
            onDragStart={(e) => onDragStart(e, task.id, column)}
            style={{ cursor: 'grab' }}
        >
            <div className="flex justify-between items-start gap-2 mb-2">
                <input
                    type="text"
                    value={task.title}
                    onChange={(e) => onUpdate(column, task.id, 'title', e.target.value)}
                    placeholder="Task title"
                    className="bg-transparent border-b border-zinc-600 text-white text-lg font-semibold w-full"
                />
            </div>

            <textarea
                value={task.description || ''}
                onChange={(e) => onUpdate(column, task.id, 'description', e.target.value)}
                placeholder="Description"
                rows={2}
                className="bg-transparent border border-zinc-600 rounded p-1 text-sm text-white w-full resize-none"
            />

            <div className="flex justify-between items-center text-xs text-zinc-500 mt-3">
                <span>{task.due_date || ''}</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDelete(column, task.id)}
                        className="text-red-500 hover:text-red-400 text-xs"
                    >
                        Delete
                    </button>
                    <GripVertical size={14} className="text-zinc-600" />
                </div>
            </div>
        </div>
    )
}

export default TaskCard
