"use client";

import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import TaskCard from "./components/task-card";
import AddTask from "./components/add-task";
import TaskFilter from "./components/task-filter";
import TaskSort from "./components/task-sort";

function App() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/todos?_limit=15",
        );

        setData(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    if (filter === "completed") {
      return item.completed === true;
    }

    if (filter === "incomplete") {
      return item.completed === false;
    }

    return true;
  });

  const deleteTask = (id) => {
    setData((prevData) => {
      return prevData.filter((item) => item.id !== id);
    });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (sort === "alphabetical") {
      return a.title.localeCompare(b.title);
    }

    if (sort === "completion") {
      return Number(a.completed) - Number(b.completed);
    }

    return 0;
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Task Tracker
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your tasks and keep track of your progress.
            </p>
          </div>

          <AddTask data={data} setData={setData} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <TaskFilter filter={filter} setFilter={setFilter} />

            <TaskSort sort={sort} setSort={setSort} />
          </div>

          <div className="p-5">
            {isLoading ? (
              <div className="flex min-h-75 items-center justify-center">
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                  <span>Loading tasks...</span>
                </div>
              </div>
            ) : sortedData.length === 0 ? (
              <div className="flex min-h-75 flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                  ✓
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                  No tasks found
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  There are no tasks matching your current filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedData.map((item) => (
                  <TaskCard key={item.id} deleteTask={deleteTask} data={item} />
                ))}
              </div>
            )}
          </div>
          {!isLoading && (
            <div className="border-t border-gray-200 px-5 py-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {sortedData.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {data.length}
                </span>{" "}
                tasks
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
