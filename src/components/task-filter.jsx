"use client";

const TaskFilter = ({ filter, setFilter }) => {
  const filters = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "incomplete", label: "Incomplete" },
  ];

  return (
    <div className="flex w-fit rounded-lg bg-gray-100 p-1">
      {filters.map((item) => (
        <button
          key={item.value}
          onClick={() => setFilter(item.value)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            filter === item.value
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;