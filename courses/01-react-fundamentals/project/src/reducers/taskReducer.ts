import type { Task } from '../components/TaskList';

export const ADD_TASK = 'ADD_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const TOGGLE_TASK = 'TOGGLE_TASK';
export const SET_TASKS = 'SET_TASKS';

type Action =
  | { type: typeof ADD_TASK; payload: Task }
  | { type: typeof UPDATE_TASK; payload: Task }
  | { type: typeof DELETE_TASK; payload: string | number }
  | { type: typeof TOGGLE_TASK; payload: string | number }
  | { type: typeof SET_TASKS; payload: Task[] };

export function taskReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case ADD_TASK:
      return [...state, action.payload];
    case UPDATE_TASK:
      return state.map((t) => t.id === action.payload.id ? { ...t, ...action.payload } : t);
    case DELETE_TASK:
      return state.filter((t) => t.id !== action.payload);
    case TOGGLE_TASK:
      return state.map((t) => t.id === action.payload ? { ...t, completed: !t.completed } : t);
    case SET_TASKS:
      return action.payload;
    default:
      return state;
  }
}

export function addTask(task: Task) { return { type: ADD_TASK as typeof ADD_TASK, payload: task }; }
export function updateTask(task: Task) { return { type: UPDATE_TASK as typeof UPDATE_TASK, payload: task }; }
export function deleteTask(id: string | number) { return { type: DELETE_TASK as typeof DELETE_TASK, payload: id }; }
export function toggleTask(id: string | number) { return { type: TOGGLE_TASK as typeof TOGGLE_TASK, payload: id }; }
export function setTasks(tasks: Task[]) { return { type: SET_TASKS as typeof SET_TASKS, payload: tasks }; }