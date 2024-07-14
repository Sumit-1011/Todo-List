import { useEffect, useState } from "react";
import Todo from "./Todo";

function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await fetch("/api/todos");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const todos = await res.json();
        setTodos(todos);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      }
    }
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      try {
        const res = await fetch("/api/todos", {
          method: "POST",
          body: JSON.stringify({ todo: content }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const newTodo = await res.json();
        setContent("");
        setTodos([...todos, newTodo]);
      } catch (error) {
        console.error("Failed to create todo:", error);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen font-poppins">
      <h1 className="text-5xl mb-8 font-semibold">Todo List</h1>
      <form
        action=""
        className="flex flex-row items-center justify-between w-full max-w-md mb-4"
        onSubmit={createNewTodo}
      >
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new Todo"
          className="p-2.5 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="px-1 ml-2 bg-gray-700 text-white rounded hover:bg-slate-900 transition-colors"
        >
          Create Todo
        </button>
      </form>
      <div className="mt-4 w-full max-w-md">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <Todo key={todo._id} todo={todo} setTodos={setTodos} />
          ))
        ) : (
          <p>No todos available</p>
        )}
      </div>
    </main>
  );
}

export default App;
