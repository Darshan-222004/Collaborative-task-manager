/**
 * TaskRepository - Data access layer handling all MongoDB operations for Task collection via Mongoose
 * Provides CRUD methods, filtering, sorting, pagination, and population of related user references (creator/assignee)
 */

import { Task, ITask, TaskStatus, TaskPriority } from '../models/Task';
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../dtos/task.dto';
import logger from '../utils/logger';

/**
 * Task Repository - Handles all database operations for Task collection
 */
export class TaskRepository {

    /**
     * Creates a new task in database
     */
    async create(taskData: CreateTaskInput & { creatorId: string }): Promise<ITask> {
        try {
            const task = new Task(taskData);
            await task.save();
            logger.info(`Task created: ${task._id}`);
            return task;
        } catch (error) {
            logger.error('Error creating task:', error);
            throw error;
        }
    }

    /**
     * Finds task by ID with populated user references
     */
    async findById(taskId: string): Promise<ITask | null> {
        try {
            const task = await Task.findById(taskId)
                .populate('creatorId', 'name email')
                .populate('assignedToId', 'name email');
            return task;
        } catch (error) {
            logger.error('Error finding task by ID:', error);
            throw error;
        }
    }

    /**
     * Finds all tasks with filtering, sorting, and pagination
     */
    async findAll(query: TaskQueryInput): Promise<{ tasks: ITask[]; total: number; page: number; limit: number }> {
        try {
            const {
                status,
                priority,
                assignedToId,
                creatorId,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                page = 1,
                limit = 10,
            } = query;

            const filter: any = {};
            if (status) filter.status = status;
            if (priority) filter.priority = priority;
            if (assignedToId) filter.assignedToId = assignedToId;
            if (creatorId) filter.creatorId = creatorId;

            const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
            const skip = (page - 1) * limit;

            const [tasks, total] = await Promise.all([
                Task.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .populate('creatorId', 'name email')
                    .populate('assignedToId', 'name email'),
                Task.countDocuments(filter),
            ]);

            return { tasks, total, page, limit };
        } catch (error) {
            logger.error('Error finding tasks:', error);
            throw error;
        }
    }

    /**
     * Updates a task by ID
     */
    async update(taskId: string, updateData: UpdateTaskInput): Promise<ITask | null> {
        try {
            const task = await Task.findByIdAndUpdate(
                taskId,
                { $set: updateData },
                { new: true, runValidators: true }
            )
                .populate('creatorId', 'name email')
                .populate('assignedToId', 'name email');

            if (task) {
                logger.info(`Task updated: ${taskId}`);
            }

            return task;
        } catch (error) {
            logger.error('Error updating task:', error);
            throw error;
        }
    }

    /**
     * Deletes a task by ID
     */
    async delete(taskId: string): Promise<ITask | null> {
        try {
            const task = await Task.findByIdAndDelete(taskId);
            if (task) {
                logger.info(`Task deleted: ${taskId}`);
            }
            return task;
        } catch (error) {
            logger.error('Error deleting task:', error);
            throw error;
        }
    }

    /**
     * Finds overdue tasks
     */
    async findOverdueTasks(userId: string): Promise<ITask[]> {
        try {
            const tasks = await Task.find({
                assignedToId: userId,
                dueDate: { $lt: new Date() },
                status: { $ne: TaskStatus.COMPLETED },
            })
                .populate('creatorId', 'name email')
                .populate('assignedToId', 'name email');

            return tasks;
        } catch (error) {
            logger.error('Error finding overdue tasks:', error);
            throw error;
        }
    }
}

export default new TaskRepository();
