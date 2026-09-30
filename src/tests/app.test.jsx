// @vitest-environment jsdom
import { StrictMode, act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import App from '../App';

vi.mock('axios', () => ({
  default: { get: vi.fn(), isCancel: (error) => error?.code === 'ERR_CANCELED' },
}));

const storageKey = 'taskly.tasks.v1';
const initial = [
  { id: 1, userId: 1, title: 'Prepare presentation', completed: false },
  { id: 2, userId: 1, title: 'Review interview notes', completed: true },
  { id: 3, userId: 1, title: 'Build portfolio', completed: false },
];
let container;
let root;

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  document.documentElement.removeAttribute('data-theme');
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false })),
  );
  localStorage.clear();
  axios.get.mockReset();
  axios.get.mockImplementation((_url, { signal }) =>
    Promise.resolve({ data: initial }).then((response) => {
      if (signal.aborted) throw { code: 'ERR_CANCELED' };
      return response;
    }),
  );
  // jsdom has no native modal implementation; test the app's dialog lifecycle.
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value() {
      this.open = true;
    },
  });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function renderApp() {
  await act(async () =>
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
}
async function click(element) {
  expect(element).toBeTruthy();
  await act(async () => element.click());
}
async function fill(element, value) {
  const prototype =
    element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype, 'value').set.call(element, value);
  await act(async () => element.dispatchEvent(new Event('input', { bubbles: true })));
}
function button(text) {
  return [...container.querySelectorAll('button')].find(
    (element) => element.textContent.trim() === text,
  );
}
function cards() {
  return [...container.querySelectorAll('.task-card')];
}
function savedTasks() {
  return JSON.parse(localStorage.getItem(storageKey));
}

describe('Taskly workflows', () => {
  it('switches themes, saves the choice, and restores it after a fresh mount', async () => {
    await renderApp();
    const toggle = () => container.querySelector('[role="switch"][aria-label="Dark mode"]');
    expect(toggle().getAttribute('aria-checked')).toBe('false');
    await click(toggle());
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(toggle().getAttribute('aria-checked')).toBe('true');
    expect(localStorage.getItem('taskly.theme')).toBe('dark');

    await act(async () => root.unmount());
    document.documentElement.removeAttribute('data-theme');
    root = createRoot(container);
    await renderApp();
    expect(document.documentElement.dataset.theme).toBe('dark');
    await click(toggle());
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('taskly.theme')).toBe('light');
  });

  it('follows the device theme when there is no explicit choice', async () => {
    window.matchMedia.mockReturnValue({ matches: true });
    await renderApp();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('taskly.theme')).toBeNull();
  });

  it('prefers a saved theme over the device preference', async () => {
    window.matchMedia.mockReturnValue({ matches: true });
    localStorage.setItem('taskly.theme', 'light');
    await renderApp();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('can switch themes when browser storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    await renderApp();
    await click(container.querySelector('[role="switch"]'));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('loads the API and keeps completion, filters, and progress in sync', async () => {
    await renderApp();
    expect(cards()).toHaveLength(3);
    expect(container.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe(
      '33',
    );
    await click(cards()[0].querySelector('input[type="checkbox"]'));
    expect(savedTasks()[0].completed).toBe(true);
    expect(container.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe(
      '67',
    );
    await click(container.querySelectorAll('.filter-tabs button')[2]);
    expect(cards()).toHaveLength(2);
    await click(cards()[0].querySelector('input[type="checkbox"]'));
    expect(cards()).toHaveLength(1);
  });

  it('creates tasks with generated unique IDs and persists edited metadata', async () => {
    await renderApp();
    await click(button('New task'));
    await fill(container.querySelector('#task-title'), '  Practise system design  ');
    await fill(container.querySelector('#task-description'), 'Review architecture tradeoffs');
    const category = container.querySelector('#task-category');
    category.value = 'Learning';
    await act(async () => category.dispatchEvent(new Event('change', { bubbles: true })));
    const priority = container.querySelector('#task-priority');
    priority.value = 'high';
    await act(async () => priority.dispatchEvent(new Event('change', { bubbles: true })));
    await act(async () =>
      container
        .querySelector('form')
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
    );
    expect(cards()).toHaveLength(4);
    const created = savedTasks()[0];
    expect(created).toMatchObject({
      title: 'Practise system design',
      category: 'Learning',
      priority: 'high',
      description: 'Review architecture tradeoffs',
    });
    expect(created.id).toMatch(/^[a-f0-9-]{36}$/);
    await click(cards()[0].querySelector('[title="Edit task"]'));
    await fill(container.querySelector('#task-title'), 'Practise API design');
    await act(async () =>
      container
        .querySelector('form')
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
    );
    expect(savedTasks()[0].id).toBe(created.id);
    expect(savedTasks()[0].title).toBe('Practise API design');
    expect(savedTasks()[0].priority).toBe('high');
  });

  it('rejects whitespace-only titles and closes the dialog without creating on cancel', async () => {
    await renderApp();
    await click(button('New task'));
    await fill(container.querySelector('#task-title'), '   ');
    await act(async () =>
      container
        .querySelector('form')
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
    );
    expect(container.querySelector('#task-title').getAttribute('aria-invalid')).toBe('true');
    expect(cards()).toHaveLength(3);
    await click(button('Cancel'));
    expect(container.querySelector('dialog')).toBeNull();
  });

  it('searches titles and descriptions, filters categories, and sorts alphabetically', async () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(
        initial.map((task, index) => ({
          ...task,
          category: index === 2 ? 'Learning' : 'Work',
          priority: 'medium',
          description: index === 2 ? 'Website samples' : '',
        })),
      ),
    );
    await renderApp();
    await fill(container.querySelector('[aria-label="Search tasks"]'), 'website');
    expect(cards()).toHaveLength(1);
    expect(cards()[0].textContent).toContain('Build portfolio');
    await click(container.querySelector('[aria-label="Clear search"]'));
    const sort = container.querySelector('[aria-label="Sort tasks"]');
    sort.value = 'alphabetical';
    await act(async () => sort.dispatchEvent(new Event('change', { bubbles: true })));
    expect(cards()[0].textContent).toContain('Build portfolio');
    await click(container.querySelectorAll('.category-link')[2]);
    expect(cards()).toHaveLength(1);
  });

  it('deletes and restores a task at its original position', async () => {
    await renderApp();
    await click(cards()[1].querySelector('[title="Delete task"]'));
    expect(savedTasks().map((task) => task.id)).toEqual([1, 3]);
    await click(button('Undo'));
    expect(savedTasks().map((task) => task.id)).toEqual([1, 2, 3]);
  });

  it('keeps an empty saved list on reload instead of importing tasks again', async () => {
    localStorage.setItem(storageKey, '[]');
    await renderApp();
    expect(axios.get).not.toHaveBeenCalled();
    expect(cards()).toHaveLength(0);
    expect(container.textContent).toContain('Add your first task');
  });

  it('shows a failure state, retries, and allows local creation when offline', async () => {
    axios.get.mockRejectedValue(new Error('Network unavailable'));
    await renderApp();
    expect(container.querySelector('[role="alert"]').textContent).toContain(
      'We couldn’t load your tasks',
    );
    expect(localStorage.getItem(storageKey)).toBeNull();
    axios.get.mockResolvedValueOnce({ data: initial });
    await click(button('Try again'));
    expect(cards()).toHaveLength(3);
  });

  it('creates local tasks after an API failure', async () => {
    axios.get.mockRejectedValue(new Error('Offline'));
    await renderApp();
    await click(button('Create a task'));
    await fill(container.querySelector('#task-title'), 'My offline task');
    await act(async () =>
      container
        .querySelector('form')
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
    );
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(savedTasks()[0].title).toBe('My offline task');
  });

  it('surfaces storage failures while keeping mutations usable', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    await renderApp();
    expect(container.textContent).toContain('Your browser couldn’t save changes');
    await click(cards()[0].querySelector('input[type="checkbox"]'));
    expect(cards()[0].classList.contains('is-completed')).toBe(true);
    expect(container.textContent).not.toContain('Saved on this device');
  });

  it('supports list layout and the search keyboard shortcut', async () => {
    await renderApp();
    await click(container.querySelector('[aria-label="List view"]'));
    expect(container.querySelector('.task-grid').classList.contains('list-view')).toBe(true);
    await act(async () =>
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
      ),
    );
    expect(document.activeElement).toBe(container.querySelector('[aria-label="Search tasks"]'));
  });

  it('recovers from malformed saved data and rejects invalid API responses', async () => {
    localStorage.setItem(storageKey, 'invalid-json');
    axios.get.mockResolvedValue({ data: [null] });
    await renderApp();
    expect(container.querySelector('[role="alert"]').textContent).toContain('We couldn’t load');
    axios.get.mockResolvedValueOnce({ data: initial });
    await click(button('Try again'));
    expect(savedTasks()).toHaveLength(3);
  });

  it('sorts by priority and exposes category filtering outside the sidebar', async () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(
        initial.map((task, index) => ({
          ...task,
          category: index === 2 ? 'Learning' : 'Work',
          priority: ['low', 'medium', 'high'][index],
        })),
      ),
    );
    await renderApp();
    const sort = container.querySelector('[aria-label="Sort tasks"]');
    sort.value = 'priority';
    await act(async () => sort.dispatchEvent(new Event('change', { bubbles: true })));
    expect(cards()[0].textContent).toContain('Build portfolio');
    const category = container.querySelector('[aria-label="Filter by category"]');
    category.value = 'Learning';
    await act(async () => category.dispatchEvent(new Event('change', { bubbles: true })));
    expect(cards()).toHaveLength(1);
    expect(cards()[0].textContent).toContain('Build portfolio');
    expect(container.querySelector('.filter-tabs button span').textContent).toBe('1');
  });
});
