import renderHtml from "./render";
import store, { addTodo, deleteTodo, editTodo, toggleTodo } from "./store";
import "./style.css";
import { LOCALSTORAGE_KEY, Todo } from "./types";

// Element references
const formEl = document.querySelector("#form") as HTMLFormElement;
const inputEl = document.querySelector("#todo-title-input") as HTMLInputElement;
const formSubmitButton = document.querySelector(
  ".todo-form-button"
) as HTMLButtonElement;
const ulEl = document.querySelector("#todo-list") as HTMLUListElement;

// global variable
let formStatus: "creating" | "editing" = "creating";
let selectedTodoId = "";

inputEl.focus();

addEventListeners();
loadFromLocalstorage();

function addEventListeners() {
  window.addEventListener("todochange", afterChangeTodo);
  formEl.addEventListener("submit", submitHandler);
  ulEl.addEventListener("click", clickOnTodoItem);
  ulEl.addEventListener("change", toggleTodoItem);
}

function loadFromLocalstorage() {
  // get store from localstorage otherwise a empty object
  const storeFromLocalStorage = JSON.parse(
    localStorage.getItem(LOCALSTORAGE_KEY) || "{}"
  );
  if (storeFromLocalStorage?.todos?.length > 0) {
    store.todos = storeFromLocalStorage.todos;
  } else {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(store));
    renderHtml();
  }
}

function afterChangeTodo() {
  renderHtml();
}

function submitHandler(e: SubmitEvent) {
  e.preventDefault();

  // getting form values
  const formData = new FormData(e.target as HTMLFormElement);
  const todoText = formData.get("todoText") as string;
  if (!todoText) {
    alert("Please enter todo text");
    return;
  }

  // action perform according to the formStatus
  switch (formStatus) {
    case "creating": {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: todoText,
        completed: false,
      };
      addTodo(newTodo);
      break;
    }
    case "editing": {
      editTodo(selectedTodoId, todoText);
      formSubmitButton.innerText = "Add";
      formStatus = "creating";
      selectedTodoId = "";
      break;
    }
    default:
      return;
  }
  formEl.reset();
}

function clickOnTodoItem(e: MouseEvent) {
  const targetEl = e.target as HTMLElement;

  // gettting the li element which was clicked
  const liEl = targetEl.closest(".todo") as HTMLElement;
  if (!liEl) return;

  // fetching id from dataset for li element
  const todoId = liEl.dataset["id"] as string;

  // clicked on delete button
  if (targetEl.classList.contains("delete-todo-button")) {
    deleteTodo(todoId);
  }
  // clicked on the area except the input checkbox
  else if (!targetEl.classList.contains("todo-checkbox")) {
    // editing todo
    const todo = store.todos.find((todo) => todo.id === todoId)!;
    if (todo.completed) {
      alert("Can't edit already completed todo.");
      return;
    }
    inputEl.value = todo.title;
    inputEl.focus();
    formSubmitButton.innerText = "Save";
    formStatus = "editing";
    selectedTodoId = todoId;
  }
}

function toggleTodoItem(e: Event) {
  const targetEl = e.target as HTMLElement;
  const liEl = targetEl.closest(".todo") as HTMLElement;
  if (!liEl) return;
  const todoId = liEl.dataset["id"] as string;
  if (targetEl.classList.contains("todo-checkbox")) {
    toggleTodo(todoId, (targetEl as HTMLInputElement).checked);
  }
}
