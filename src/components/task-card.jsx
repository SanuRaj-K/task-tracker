"use client";

import { useState } from "react";

function TaskCard({ data,deleteTask  }) {
  const [completed, setCompleted] = useState(data.completed);

  const handleToggle = () => {
    setCompleted((prev) => !prev);
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <h2
          className={`text-lg font-semibold ${
            completed ? "text-gray-400 line-through" : "text-gray-800"
          }`}
        >
          {data.title}
        </h2>

        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 cursor-pointer"
        />
      </div>

      <p className="mt-4 text-sm text-gray-600">
        <span className="font-medium">ID:</span> {data.id}
      </p>

      <p
        className={`mt-2 text-sm font-medium ${
          completed ? "text-green-600" : "text-orange-500"
        }`}
      >
        {completed ? "✓ Completed" : "○ Pending"}
      </p>
       <button
        onClick={() => deleteTask(data.id)}
        className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white"
      >
        Delete
      </button>
    </div>
  );
}

export default TaskCard;
