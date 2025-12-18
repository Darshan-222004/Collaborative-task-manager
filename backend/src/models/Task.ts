import mongoose, { Document, Schema } from 'mongoose';

/**
 * Enum for task priority levels
 */
export enum TaskPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    URGENT = 'Urgent',
}

/**
 * Enum for task status workflow
 */
export enum TaskStatus {
    TODO = 'To Do',
    IN_PROGRESS = 'In Progress',
    REVIEW = 'Review',
    COMPLETED = 'Completed',
}

/**
 * Interface defining Task document structure in TypeScript
 */
export interface ITask extends Document {
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
    creatorId: mongoose.Types.ObjectId | string;
    assignedToId: mongoose.Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
    history: {
        action: string;
        changedBy: mongoose.Types.ObjectId | string;
        details?: string;
        timestamp: Date;
    }[];
}

/**
 * Mongoose schema for Task collection
 */
const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Task description is required'],
            trim: true,
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
            validate: {
                validator: function (value: Date) {
                    return value > new Date();
                },
                message: 'Due date must be in the future',
            },
        },
        priority: {
            type: String,
            enum: {
                values: Object.values(TaskPriority),
                message: '{VALUE} is not a valid priority',
            },
            required: [true, 'Priority is required'],
            default: TaskPriority.MEDIUM,
        },
        status: {
            type: String,
            enum: {
                values: Object.values(TaskStatus),
                message: '{VALUE} is not a valid status',
            },
            required: [true, 'Status is required'],
            default: TaskStatus.TODO,
        },
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Creator ID is required'],
        },
        assignedToId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Assigned user ID is required'],
        },
        history: [{
            action: { type: String, required: true }, // e.g., 'CREATED', 'UPDATED', 'STATUS_CHANGE'
            changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            details: { type: String },
            timestamp: { type: Date, default: Date.now }
        }],
    },
    {
        timestamps: true,
    }
);

/**
 * Index for efficient querying by assignedToId
 */
TaskSchema.index({ assignedToId: 1 });

/**
 * Index for efficient querying by creatorId
 */
TaskSchema.index({ creatorId: 1 });

/**
 * Index for efficient querying by status
 */
TaskSchema.index({ status: 1 });

/**
 * Index for efficient querying by dueDate
 */
TaskSchema.index({ dueDate: 1 });

/**
 * Compound index for filtering by status and priority
 */
TaskSchema.index({ status: 1, priority: 1 });

/**
 * Remove __v from JSON output
 */
TaskSchema.set('toJSON', {
    transform: function (doc, ret) {
        if (ret.__v !== undefined) {
            delete ret.__v;
        }
        return ret;
    },
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);