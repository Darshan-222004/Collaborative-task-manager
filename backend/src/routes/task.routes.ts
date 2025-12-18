import { Router } from 'express';
import taskController from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Task Routes - All routes require authentication
 */
router.use(authenticate);

// Dashboard routes
router.get('/assigned/me', taskController.getMyAssignedTasks);
router.get('/created/me', taskController.getMyCreatedTasks);
router.get('/overdue/me', taskController.getMyOverdueTasks);

// CRUD routes
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
