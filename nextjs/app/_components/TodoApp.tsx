"use client";

import { useEffect, useState, type FormEvent } from "react";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "todos";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  // 서버/첫 렌더에서는 localStorage를 모르므로, 마운트 이후에만 데이터를 신뢰합니다.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTodos(JSON.parse(raw) as Todo[]);
    } catch {
      // 손상된 데이터는 무시
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, hydrated]);

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, done: false },
    ]);
    setText("");
  };

  const toggle = (id: number) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  const remove = (id: number) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="text-2xl font-semibold tracking-tight">TODO</h1>

      <form onSubmit={handleAdd} className="mt-6 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일을 입력하세요"
          autoComplete="off"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          추가
        </button>
      </form>

      <ul className="mt-6 flex flex-col gap-2">
        {hydrated && todos.length === 0 && (
          <li className="rounded-lg border border-dashed border-zinc-300 px-3 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
            아직 할 일이 없어요.
          </li>
        )}
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800"
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggle(todo.id)}
              className="h-4 w-4 cursor-pointer"
            />
            <span
              className={`flex-1 text-sm ${
                todo.done ? "text-zinc-400 line-through" : ""
              }`}
            >
              {todo.text}
            </span>
            <button
              type="button"
              onClick={() => remove(todo.id)}
              className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      <footer className="mt-6 flex items-center justify-between text-xs text-zinc-500">
        <span>
          {hydrated && todos.length > 0
            ? `남은 할 일 ${remaining}개 / 전체 ${todos.length}개`
            : " "}
        </span>
        <button
          type="button"
          onClick={clearDone}
          disabled={!todos.some((t) => t.done)}
          className="rounded-md px-2 py-1 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-zinc-800"
        >
          완료된 항목 지우기
        </button>
      </footer>
    </section>
  );
}
