import React, { useState, useEffect, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import taskService from '../services/taskService';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const outletContext = useOutletContext() || {};

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    overdue: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Dashboard Stats and Recent Tasks from API
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsData, tasksData] = await Promise.all([
        taskService.getTaskStats(),
        taskService.getTasks({ sortBy: 'createdAt', sortOrder: 'desc' }),
      ]);

      if (statsData.success) {
        setStats(statsData.stats);
      }
      if (tasksData.success) {
        setRecentTasks(tasksData.tasks.slice(0, 6)); // Top 6 most recent
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      error(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, outletContext.taskRefreshTrigger]);

  // Update Status directly from card
  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await taskService.updateTask(task._id, { status: newStatus });
      if (res.success) {
        success(`Task marked as ${newStatus}`);
        fetchDashboardData();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update task status');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleSaveEdit = async (updatedData) => {
    if (!selectedTask) return;
    setIsSubmitting(true);
    try {
      const res = await taskService.updateTask(selectedTask._id, updatedData);
      if (res.success) {
        success('Task updated successfully');
        setIsEditModalOpen(false);
        setSelectedTask(null);
        fetchDashboardData();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedTask) return;
    setIsSubmitting(true);
    try {
      const res = await taskService.deleteTask(selectedTask._id);
      if (res.success) {
        success('Task deleted successfully');
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
        fetchDashboardData();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-100 mb-3 border border-white/10">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="mt-1 text-sm text-indigo-100 max-w-xl">
              You have {stats.pending + stats.inProgress} active task
              {stats.pending + stats.inProgress !== 1 ? 's' : ''} to complete.
              Stay focused and keep flowing!
            </p>
          </div>

          <button
            onClick={outletContext.openNewTaskModal}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-indigo-50 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Create Task
          </button>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 -bottom-10 opacity-10 pointer-events-none">
          <Sparkles className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Statistics Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Task Overview</h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>{completionPercentage}% Finished</span>
          </div>
        </div>

        {/* 5 Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Tasks"
            count={stats.total}
            icon={CheckSquare}
            color="indigo"
            subtitle="All registered tasks"
          />
          <StatCard
            title="Pending"
            count={stats.pending}
            icon={Clock}
            color="amber"
            subtitle="Awaiting start"
          />
          <StatCard
            title="In Progress"
            count={stats.inProgress}
            icon={PlayCircle}
            color="blue"
            subtitle="Currently working"
          />
          <StatCard
            title="Completed"
            count={stats.completed}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Successfully done"
          />
          <StatCard
            title="High Priority"
            count={stats.highPriority}
            icon={AlertTriangle}
            color="rose"
            subtitle="Urgent attention"
          />
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completion Rate
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
          <div className="w-full sm:flex-1 max-w-md bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-sm font-extrabold text-indigo-600">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Tasks</h2>
            <p className="text-xs text-slate-500">
              Your most recently created or updated work items
            </p>
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner text="Loading recent tasks..." />
        ) : recentTasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="You don't have any tasks in your workspace. Start by creating one to streamline your workflow!"
            actionText="Create First Task"
            onAction={outletContext.openNewTaskModal}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
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

export default Dashboard;
