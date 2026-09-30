import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  LayoutGrid,
  List,
  Calendar,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import taskService from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { useToast } from '../context/ToastContext';

const Tasks = () => {
  const outletContext = useOutletContext() || {};
  const { success, error } = useToast();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search & Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modal States
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await taskService.getTasks({
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        sortOrder,
      });

      if (res.success) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      error(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter, priorityFilter, sortBy, sortOrder, error]);

  // Debounced search / trigger on filter change
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(handler);
  }, [fetchTasks, outletContext.taskRefreshTrigger]);

  // Quick Status change
  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await taskService.updateTask(task._id, { status: newStatus });
      if (res.success) {
        success(`Task status updated to ${newStatus}`);
        fetchTasks();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update task status');
    }
  };

  // Edit Task
  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (taskData) => {
    if (!selectedTask) return;
    setIsSubmitting(true);
    try {
      const res = await taskService.updateTask(selectedTask._id, taskData);
      if (res.success) {
        success('Task updated successfully');
        setIsEditModalOpen(false);
        setSelectedTask(null);
        fetchTasks();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Task
  const handleOpenDelete = (task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTask) return;
    setIsSubmitting(true);
    try {
      const res = await taskService.deleteTask(selectedTask._id);
      if (res.success) {
        success('Task deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
        fetchTasks();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    sortBy !== 'createdAt' ||
    sortOrder !== 'desc';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            All Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, filter, and track all your tasks in one unified view
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View switcher: Grid / List */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={outletContext.openNewTaskModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:scale-[0.98] shadow-md shadow-indigo-100 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters: Priority & Sorting */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="font-semibold">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="All">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Sort Field */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="createdAt">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title (Alphabetical)</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Sort Direction Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
          </div>

          {/* Reset Filters button if any are applied */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Task List or Grid */}
      {isLoading ? (
        <LoadingSpinner text="Fetching tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No matching tasks' : 'No tasks created yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search criteria or resetting filters to see more tasks.'
              : 'Keep track of projects, goals, and daily tasks all in one place.'
          }
          actionText={hasActiveFilters ? 'Reset Filters' : 'Create Task'}
          onAction={
            hasActiveFilters ? clearAllFilters : outletContext.openNewTaskModal
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
          {tasks.map((task) => {
            const isOverdue =
              task.dueDate &&
              new Date(task.dueDate) < new Date() &&
              task.status !== 'Completed';

            return (
              <div
                key={task._id}
                className="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                  <h4
                    className={`text-base font-bold truncate ${
                      task.status === 'Completed'
                        ? 'line-through text-slate-400'
                        : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  {task.dueDate ? (
                    <div className="flex items-center gap-1.5">
                      <Calendar
                        className={`w-3.5 h-3.5 ${
                          isOverdue ? 'text-rose-500' : 'text-slate-400'
                        }`}
                      />
                      <span
                        className={
                          isOverdue ? 'text-rose-600 font-semibold' : ''
                        }
                      >
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">No due date</span>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleOpenDelete(task)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSubmit={handleSaveEdit}
        isLoading={isSubmitting}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        taskTitle={selectedTask?.title}
        onConfirm={handleConfirmDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Tasks;
