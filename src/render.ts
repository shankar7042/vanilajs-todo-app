import store from "./store";
import { Todo } from "./types";

function renderHtml() {
  const todos = store.todos;

  const ulEl = document.querySelector("#todo-list") as HTMLUListElement;
  const html: string = todos
    .map((todo: Todo) => {
      return `
        <li class="todo" data-id="${todo.id}">
            <span class="todo-title ${todo.completed ? "completed" : ""}">${
        todo.title
      }</span>
            <div class="toggle-delete">
                <input type="checkbox" name="completed" class="todo-checkbox" ${
                  todo.completed ? "checked" : ""
                } />
                <button class="delete-todo-button">x</button>
            </div>
        </li>
    `;
    })
    .join("");
  ulEl.innerHTML = html;
}

export default renderHtml;
