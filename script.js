const STORAGE_KEY = "todos";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const count = document.getElementById("todo-count");
const clearDoneBtn = document.getElementById("clear-done");

let todos = load();
render();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, done: false });
  input.value = "";
  save();
  render();
});

list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.matches(".delete-btn")) {
    todos = todos.filter((t) => t.id !== id);
    save();
    render();
  } else if (e.target.matches('input[type="checkbox"]')) {
    todos = todos.map((t) =>
      t.id === id ? { ...t, done: e.target.checked } : t
    );
    save();
    render();
  }
});

clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  save();
  render();
});

function render() {
  list.innerHTML = todos
    .map(
      (t) => `
        <li data-id="${t.id}" class="${t.done ? "done" : ""}">
          <input type="checkbox" ${t.done ? "checked" : ""}>
          <span class="text">${escapeHtml(t.text)}</span>
          <button class="delete-btn" type="button">삭제</button>
        </li>
      `
    )
    .join("");

  const remaining = todos.filter((t) => !t.done).length;
  count.textContent =
    todos.length === 0 ? "" : `남은 할 일 ${remaining}개 / 전체 ${todos.length}개`;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 사용자가 입력한 텍스트를 그대로 innerHTML에 넣으면 XSS 위험이 있으므로 이스케이프합니다.
function escapeHtml(str) {
  return str.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c])
  );
}
