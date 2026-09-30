import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const STORAGE_KEY = 'taskly.tasks.v1';

function readTasks() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(value)) return null;
    if (
      !value.every(
        (task) =>
          task &&
          (typeof task.id === 'string' || typeof task.id === 'number') &&
          typeof task.title === 'string' &&
          (task.description === undefined || typeof task.description === 'string') &&
          typeof task.completed === 'boolean' &&
          ['Work', 'Personal', 'Learning'].includes(task.category) &&
          ['low', 'medium', 'high'].includes(task.priority),
      )
    )
      return null;
    if (new Set(value.map((task) => String(task.id))).size !== value.length) return null;
    return value;
  } catch {
    return null;
  }
}

export default function useTasks() {
  const [cached] = useState(readTasks);
  const [tasks, setTasks] = useState(cached || []);
  const [isLoading, setIsLoading] = useState(cached === null);
  const [ready, setReady] = useState(cached !== null);
  const [error, setError] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (cached !== null) return;
    const controller = new AbortController();
    axios
      .get('https://jsonplaceholder.typicode.com/todos?_limit=15', {
        signal: controller.signal,
        timeout: 12000,
      })
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        if (
          !Array.isArray(data) ||
          !data.every(
            (task) =>
              task &&
              typeof task.id === 'number' &&
              typeof task.title === 'string' &&
              typeof task.completed === 'boolean',
          ) ||
          new Set(data.map((task) => task.id)).size !== data.length
        )
          throw new Error('Invalid task response');
        setTasks(
          data.map((task) => ({ ...task, category: 'Work', priority: 'medium', description: '' })),
        );
        setReady(true);
      })
      .catch((failure) => {
        if (!controller.signal.aborted && !axios.isCancel(failure)) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [cached, attempt]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage is an external system; surface a failed write instead of claiming it was saved.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageError(true);
    }
  }, [tasks, ready]);

  const addTask = useCallback((values) => {
    const id = crypto.randomUUID();
    setTasks((current) => [{ ...values, id, userId: 1 }, ...current]);
    setReady(true);
    setError(false);
  }, []);
  const updateTask = useCallback(
    (id, values) =>
      setTasks((current) =>
        current.map((task) => (task.id === id ? { ...task, ...values } : task)),
      ),
    [],
  );
  const deleteTask = useCallback(
    (id) => setTasks((current) => current.filter((task) => task.id !== id)),
    [],
  );
  const restoreTask = useCallback(
    (task, index) =>
      setTasks((current) =>
        current.some((item) => item.id === task.id)
          ? current
          : [...current.slice(0, index), task, ...current.slice(index)],
      ),
    [],
  );
  const retry = () => {
    setError(false);
    setIsLoading(true);
    setAttempt((value) => value + 1);
  };
  return {
    tasks,
    isLoading,
    error,
    storageError,
    retry,
    addTask,
    updateTask,
    deleteTask,
    restoreTask,
  };
}
