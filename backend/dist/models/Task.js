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
exports.Task = exports.TaskStatus = exports.TaskPriority = void 0;
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Enum for task priority levels
 */
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "Low";
    TaskPriority["MEDIUM"] = "Medium";
    TaskPriority["HIGH"] = "High";
    TaskPriority["URGENT"] = "Urgent";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
/**
 * Enum for task status workflow
 */
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "To Do";
    TaskStatus["IN_PROGRESS"] = "In Progress";
    TaskStatus["REVIEW"] = "Review";
    TaskStatus["COMPLETED"] = "Completed";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
/**
 * Mongoose schema for Task collection
 */
const TaskSchema = new mongoose_1.Schema({
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
            validator: function (value) {
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required'],
    },
    assignedToId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Assigned user ID is required'],
    },
    history: [{
            action: { type: String, required: true }, // e.g., 'CREATED', 'UPDATED', 'STATUS_CHANGE'
            changedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            details: { type: String },
            timestamp: { type: Date, default: Date.now }
        }],
}, {
    timestamps: true,
});
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
exports.Task = mongoose_1.default.model('Task', TaskSchema);
