"use strict";
/**
 * TaskRepository - Data access layer handling all MongoDB operations for Task collection via Mongoose
 * Provides CRUD methods, filtering, sorting, pagination, and population of related user references (creator/assignee)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const Task_1 = require("../models/Task");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Task Repository - Handles all database operations for Task collection
 */
class TaskRepository {
    /**
     * Creates a new task in database
     */
    async create(taskData) {
        try {
            const task = new Task_1.Task(taskData);
            await task.save();
            logger_1.default.info(`Task created: ${task._id}`);
            return task;
        }
        catch (error) {
            logger_1.default.error('Error creating task:', error);
            throw error;
        }
    }
    /**
     * Finds task by ID with populated user references
     */
    async findById(taskId) {
        try {
            const task = await Task_1.Task.findById(taskId)
                .populate('creatorId', 'name email')
                .populate('assignedToId', 'name email');
            return task;
        }
        catch (error) {
            logger_1.default.error('Error finding task by ID:', error);
            throw error;
        }
    }
    /**
     * Finds all tasks with filtering, sorting, and pagination
     */
    async findAll(query) {
        try {
            const { status, priority, assignedToId, creatorId, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10, } = query;
            const filter = {};
            if (status)
                filter.status = status;
            if (priority)
                filter.priority = priority;
            if (assignedToId)
                filter.assignedToId = assignedToId;
            if (creatorId)
                filter.creatorId = creatorId;
            const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
            const skip = (page - 1) * limit;
            const [tasks, total] = await Promise.all([
                Task_1.Task.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .populate('creatorId', 'name email')
                    .populate('assignedToId', 'name email'),
                Task_1.Task.countDocuments(filter),
            ]);
            return { tasks, total, page, limit };
        }
        catch (error) {
            logger_1.default.error('Error finding tasks:', error);
            throw error;
        }
    }
    /**
     * Updates a task by ID
     */
    async update(taskId, updateData) {
        try {
            const task = await Task_1.Task.findByIdAndUpdate(taskId, { $set: updateData }, { new: true, runValidators: true })
                .populate('creatorId', 'name email')
                .populate('assignedToId', 'name email');
            if (task) {
                logger_1.default.info(`Task updated: ${taskId}`);
            }
            return task;
        }
        catch (error) {
            logger_1.default.error('Error updating task:', error);
            throw error;
        }
    }
    /**
     * Deletes a task by ID
     */
    async delete(taskId) {
        try {
            const task = await Task_1.Task.findByIdAndDelete(taskId);
            if (task) {
                logger_1.default.info(`Task deleted: ${taskId}`);
            }
            return task;
        }
        catch (error) {
            logger_1.default.error('Error deleting task:', error);
            throw error;
        }
    }
    /**
     * Finds overdue tasks
     */
    async findOverdueTasks(userId) {
        try {
            const tasks = await Task_1.Task.find({
                assignedToId: userId,
                dueDate: { $lt: new Date() },
                status: { $ne: Task_1.TaskStatus.COMPLETED },
            })
                .populate('creatorId', 'name email')
                .populate('assignedToId', 'name email');
            return tasks;
        }
        catch (error) {
            logger_1.default.error('Error finding overdue tasks:', error);
            throw error;
        }
    }
}
exports.TaskRepository = TaskRepository;
exports.default = new TaskRepository();
