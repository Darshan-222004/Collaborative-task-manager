const { TaskService } = require('../services/task.service');

// Mock the dependencies
jest.mock('../repositories/task.repository');
jest.mock('../repositories/user.repository');
jest.mock('../services/notification.service');
jest.mock('../utils/logger');

const taskRepository = require('../repositories/task.repository').default;
const userRepository = require('../repositories/user.repository').default;
const notificationService = require('../services/notification.service').default;

describe('TaskService', () => {
    let taskService;

    beforeEach(() => {
        jest.clearAllMocks();
        taskService = new TaskService();
    });

    /**
     * Test 1: Successfully create a task with valid data when assigned user exists
     */
    test('should create task with valid data when assigned user exists', async () => {
        // Arrange
        const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            name: 'John Doe',
            email: 'john@example.com',
        };

        const taskData = {
            title: 'Test Task',
            description: 'This is a test task',
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            priority: 'High',
            status: 'To Do',
            assignedToId: '507f1f77bcf86cd799439011',
        };

        const mockCreatedTask = {
            _id: '507f1f77bcf86cd799439012',
            ...taskData,
            creatorId: '507f1f77bcf86cd799439013',
            toJSON: () => ({
                _id: '507f1f77bcf86cd799439012',
                ...taskData,
            }),
        };

        // Setup mocks
        userRepository.findById.mockResolvedValue(mockUser);
        taskRepository.create.mockResolvedValue(mockCreatedTask);
        notificationService.createTaskAssignmentNotification.mockResolvedValue({});

        // Act
        const result = await taskService.createTask(taskData, '507f1f77bcf86cd799439013');

        // Assert
        expect(userRepository.findById).toHaveBeenCalledWith(taskData.assignedToId);
        expect(taskRepository.create).toHaveBeenCalled();
        expect(notificationService.createTaskAssignmentNotification).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result.title).toBe('Test Task');
    });

    /**
     * Test 2: Throw error when assigned user does not exist
     */
    test('should throw error when assigned user does not exist', async () => {
        // Arrange
        const taskData = {
            title: 'Test Task',
            description: 'Invalid assignee',
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            priority: 'Medium',
            status: 'To Do',
            assignedToId: 'nonexistent123',
        };

        // Mock userRepository to return null
        userRepository.findById.mockResolvedValue(null);

        // Act & Assert
        await expect(
            taskService.createTask(taskData, '507f1f77bcf86cd799439013')
        ).rejects.toThrow('Assigned user not found');

        expect(userRepository.findById).toHaveBeenCalledWith('nonexistent123');
        expect(taskRepository.create).not.toHaveBeenCalled();
    });

    /**
     * Test 3: Should not create notification when assigning task to self
     */
    test('should not create notification when user assigns task to themselves', async () => {
        // Arrange
        const userId = '507f1f77bcf86cd799439013';
        const mockUser = {
            _id: userId,
            name: 'John Doe',
            email: 'john@example.com',
        };

        const taskData = {
            title: 'Self-assigned Task',
            description: 'Self assignment',
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            priority: 'Low',
            status: 'To Do',
            assignedToId: userId,
        };

        const mockCreatedTask = {
            _id: '507f1f77bcf86cd799439012',
            ...taskData,
            creatorId: userId,
            toJSON: () => ({
                _id: '507f1f77bcf86cd799439012',
                ...taskData,
            }),
        };

        // Setup mocks
        userRepository.findById.mockResolvedValue(mockUser);
        taskRepository.create.mockResolvedValue(mockCreatedTask);

        // Act
        const result = await taskService.createTask(taskData, userId);

        // Assert
        expect(notificationService.createTaskAssignmentNotification).not.toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result.title).toBe('Self-assigned Task');
    });
});
