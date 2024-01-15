export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface Store {
  todos: Todo[];
}

export const LOCALSTORAGE_KEY = "vanillajs-todos";
