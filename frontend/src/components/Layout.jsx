import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TaskModal from './TaskModal';
import taskService from '../services/taskService';
import { useToast } from '../context/ToastContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskRefreshTrigger, setTaskRefreshTrigger] = useState(0);

  const { success, error } = useToast();

  const handleCreateTask = async (taskData) => {
    setIsCreatingTask(true);
    try {
      await taskService.createTask(taskData);
      success('Task created successfully!');
      setIsTaskModalOpen(false);
      // Trigger refresh on active views
      setTaskRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsCreatingTask(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Sidebar for navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenNewTask={() => setIsTaskModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenNewTask={() => setIsTaskModalOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet
            context={{
              taskRefreshTrigger,
              triggerRefresh: () => setTaskRefreshTrigger((prev) => prev + 1),
              openNewTaskModal: () => setIsTaskModalOpen(true),
            }}
          />
        </main>
      </div>

      {/* Global Quick Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={isCreatingTask}
      />
    </div>
  );
};

export default Layout;
