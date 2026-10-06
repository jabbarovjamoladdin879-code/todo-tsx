import { useEffect, useMemo, useState } from "react";

type Todo = {
  id: number;
  text: string;
  done: boolean;
}

type Filter = "all" | "active" | "done"

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem("todos")
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}
function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [text, setText] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [editId, setEditId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const visible = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done)
    if (filter === "done") return todos.filter((t) => t.done)
    return todos
  }, [todos, filter])

  function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setTodos([...todos, { id: Date.now(), text: text.trim(), done: false }])
    setText("")
  }

  function toggleTodo(id: number) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((t) => t.id !== id))
  }

  function startEdit(item: Todo) {
    setEditId(item.id)
    setEditText(item.text)
  }

  function saveEdit() {
    if (editText.trim()) {
      setTodos(todos.map((t) => (t.id === editId ? { ...t, text: editText.trim() } : t)))
    }
    setEditId(null)
    setEditText("")
  }

  return (
    <div className="container max-w-7xl  mx-auto mt-[50px] flex justify-center">
      <div className="box w-full">
        <h1 className="text-3xl">ToDo App</h1>

        <form onSubmit={addTodo} className="flex gap-3 mt-5">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Qo'shiladigan vazifa..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-indigo-600"
          />
          <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg cursor-pointer">
            Qo'shish
          </button>
        </form>

        <div className="flex gap-2 mt-4 text-sm">
          <button onClick={() => setFilter("all")} className={filter === "all" ? "font-bold" : "opacity-50"}>Hammasi</button>
          <button onClick={() => setFilter("active")} className={filter === "active" ? "font-bold" : "opacity-50"}>Bajarilmagan</button>
          <button onClick={() => setFilter("done")} className={filter === "done" ? "font-bold" : "opacity-50"}>Bajarilgan</button>
        </div>

        <ul className="list mt-4">
          {
            visible.length === 0 && <li className="opacity-50"><p>Hech qanday vazifa yoq</p></li>
          }
          {
            visible.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-1">
                <input type="checkbox" checked={item.done} onChange={() => toggleTodo(item.id)} />
                {editId === item.id ? (
                  <input
                    type="text"
                    value={editText}
                    autoFocus
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="flex-1 border-b outline-none"
                  />
                ) : (
                  <span className={`flex-1 ${item.done ? "line-through opacity-50" : ""}`}>{item.text}</span>
                )}
                <button onClick={() => startEdit(item)} className="cursor-pointer">✏️</button>
                <button onClick={() => deleteTodo(item.id)} className="cursor-pointer">🗑️</button>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default App
