"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.NotificationType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Enum for notification types
 */
var NotificationType;
(function (NotificationType) {
    NotificationType["TASK_ASSIGNED"] = "task_assigned";
    NotificationType["TASK_UPDATED"] = "task_updated";
    NotificationType["TASK_COMPLETED"] = "task_completed";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
/**
 * Mongoose schema for Notification collection
 */
const NotificationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true, // Index for faster queries by user
    },
    taskId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});
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
exports.Notification = mongoose_1.default.model('Notification', NotificationSchema);
