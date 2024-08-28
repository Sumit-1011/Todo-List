import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import for navigation
import Todo from "./Todo";
import config from "../config";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  //const [userEmail, setUserEmail] = useState(""); // State to store user email
  const navigate = useNavigate(); // Use navigate for navigation

  useEffect(() => {
    async function getTodos() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${config.apiBaseUrl}/api/todos`, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const todos = await res.json();
        setTodos(todos);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
        setError("Failed to fetch todos.");
      }
    }
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${config.apiBaseUrl}/api/todos`, {
          method: "POST",
          body: JSON.stringify({ todo: content }),
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const newTodo = await res.json();
        setContent("");
        setTodos([...todos, newTodo]);
        setError(null);
      } catch (error) {
        console.error("Failed to create todo:", error);
        setError("Failed to create todo.");
      }
    } else {
      setError("Todo content must be at least 4 characters long.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen font-poppins floating">
      <div className="flex justify-between w-full max-w-md mb-4">
        <h1 className="text-5xl font-semibold">Todo List</h1>
        <button
          onClick={handleSignOut}
          className="absolute top-8 right-8 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 transition-colors"
        >
          Sign Out
        </button>
      </div>
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
      {error && <p className="text-red-500">{error}</p>}
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
};

export default TodoList;
