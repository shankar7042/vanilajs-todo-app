import { LOCALSTORAGE_KEY, Store, Todo } from "./types";

const store: Store = {
  todos: [],
};

const storeProxy = new Proxy<Store>(store, {
  get(target, p: keyof Store) {
    return target[p];
  },
  set(target, p: keyof Store, newValue) {
    target[p] = newValue;
    if (p === "todos") window.dispatchEvent(new Event("todochange"));
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(target));
    return true;
  },
});

export const addTodo = (todo: Todo) => {
  storeProxy.todos = [todo, ...storeProxy.todos];
};

export const deleteTodo = (id: string) => {
  storeProxy.todos = storeProxy.todos.filter((todo) => todo.id !== id);
};

export const toggleTodo = (id: string, completeVal: boolean) => {
  storeProxy.todos = storeProxy.todos.map((todo) => {
    return todo.id === id ? { ...todo, completed: completeVal } : todo;
  });
};

export const editTodo = (id: string, title: string) => {
  storeProxy.todos = storeProxy.todos.map((todo) => {
    return todo.id === id ? { ...todo, title } : todo;
  });
};

export default storeProxy;
