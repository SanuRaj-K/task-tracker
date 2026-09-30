"use client";

const TaskSort = ({ sort, setSort }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort:</span>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
      >
        <option className=" cursor-pointer" value="default">
          Default
        </option>
        <option className=" cursor-pointer" value="alphabetical">
          Alphabetical
        </option>
        <option className=" cursor-pointer" value="completion">
          Completion
        </option>
      </select>
    </div>
  );
};

export default TaskSort;
