"use client";

import { useState } from "react";

const AddTask = ({ setData }) => {
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  const [task, setTask] = useState({
    title: "",
    userId: "",
    id: "",
    completed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setData((prevData) => [...prevData, task]);

    setShowNewTaskModal(false);

    setTask({
      title: "",
      userId: "",
      id: "",
      completed: false,
    });
  };

  return (
    <div className="">
      <button
        onClick={() => setShowNewTaskModal(true)}
        className="cursor-pointer rounded-md bg-black p-3 font-bold text-white"
      >
        Add New Task
      </button>

      {showNewTaskModal && (
        <div className="fixed inset-0 flex items-center justify-center m-4 md:m-0 bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Task</h2>

              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="cursor-pointer text-xl text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>

                <input
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  User ID
                </label>

                <input
                  type="number"
                  name="userId"
                  value={task.userId}
                  onChange={handleChange}
                  placeholder="Enter user ID"
                  className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Task ID
                </label>

                <input
                  type="number"
                  name="id"
                  value={task.id}
                  onChange={handleChange}
                  placeholder="Enter task ID"
                  className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-black"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="completed"
                  checked={task.completed}
                  onChange={handleChange}
                  className="h-5 w-5 cursor-pointer"
                />

                <label className="text-sm font-medium">Completed</label>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-md bg-black py-3 font-semibold text-white hover:bg-gray-800"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTask;
