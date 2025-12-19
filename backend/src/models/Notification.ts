import mongoose, { Document, Schema } from 'mongoose';

/**
 * Enum for notification types
 */
export enum NotificationType {
    TASK_ASSIGNED = 'task_assigned',
    TASK_UPDATED = 'task_updated',
    TASK_COMPLETED = 'task_completed',
}

/**
 * Interface defining Notification document structure
 */
export interface INotification extends Document {
    _id: string;
    userId: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId;
    type: NotificationType;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Mongoose schema for Notification collection
 */
const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true, // Index for faster queries by user
        },
        taskId: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
            required: [true, 'Task ID is required'],
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: [true, 'Notification type is required'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            maxlength: [500, 'Message cannot exceed 500 characters'],
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true, // Index for faster unread queries
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

/**
 * Index for efficient querying of unread notifications
 */
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

/**
 * Remove sensitive fields from JSON output
 */
NotificationSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    },
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
