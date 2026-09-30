const mongoose = require('mongoose');
const Task = require('../models/Task');

// @desc    Get all tasks for current user (with search, filter, sort)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = { user: req.user._id };

    // Status filter
    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      query.status = status;
    }

    // Priority filter
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    // Search query on title or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Sorting options
    const allowedSortFields = ['createdAt', 'updatedAt', 'dueDate', 'title', 'priority', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;

    const tasks = await Task.find(query).sort({ [sortField]: order });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, pending, inProgress, completed, highPriority, overdue] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'Pending' }),
      Task.countDocuments({ user: userId, status: 'In Progress' }),
      Task.countDocuments({ user: userId, status: 'Completed' }),
      Task.countDocuments({ user: userId, priority: 'High', status: { $ne: 'Completed' } }),
      Task.countDocuments({
        user: userId,
        dueDate: { $lt: new Date() },
        status: { $ne: 'Completed' },
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        completed,
        highPriority,
        overdue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found with specified ID',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const taskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      user: req.user._id,
    };

    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      taskData.status = status;
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      taskData.priority = priority;
    }

    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (!isNaN(parsedDate.getTime())) {
        taskData.dueDate = parsedDate;
      }
    }

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found with specified ID',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Ownership check
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this task',
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot be empty',
        });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (status !== undefined) {
      if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be Pending, In Progress, or Completed',
        });
      }
      task.status = status;
    }

    if (priority !== undefined) {
      if (!['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid priority. Must be Low, Medium, or High',
        });
      }
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      if (dueDate === null || dueDate === '') {
        task.dueDate = null;
      } else {
        const parsedDate = new Date(dueDate);
        if (!isNaN(parsedDate.getTime())) {
          task.dueDate = parsedDate;
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid due date format',
          });
        }
      }
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found with specified ID',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Ownership check
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      taskId: id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
