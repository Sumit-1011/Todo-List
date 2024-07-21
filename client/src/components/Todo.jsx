import { useState } from "react";

const Todo = (props) => {
  const { todo, setTodos } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.todo);

  const updateTodo = async (todoId, todoStatus) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({ status: !todoStatus }), // Toggle status
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"), // Ensure token is included
        },
      });

      if (res.ok) {
        setTodos((currentTodos) => {
          return currentTodos.map((currentTodo) => {
            if (currentTodo._id === todoId) {
              return { ...currentTodo, status: !todoStatus };
            }
            return currentTodo;
          });
        });
      } else {
        const json = await res.json();
        console.error("Failed to update todo:", json.message);
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"), // Ensure token is included
        },
      });
      const json = await res.json();
      if (res.status === 200) {
        setTodos((currentTodos) =>
          currentTodos.filter((currentTodo) => currentTodo._id !== todoId)
        );
      } else {
        console.error("Failed to delete todo:", json.message);
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const saveEdit = async (todoId) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({ todo: editContent, status: todo.status }),
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      });

      const json = await res.json();
      if (json.modifiedCount > 0) {
        setTodos((currentTodos) => {
          return currentTodos.map((currentTodo) => {
            if (currentTodo._id === todoId) {
              return { ...currentTodo, todo: editContent };
            }
            return currentTodo;
          });
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to save edit:", error);
    }
  };

  return (
    <div className="p-4 border rounded mb-2 flex justify-between items-center bg-gray-50 hover:bg-gray-200">
      {isEditing ? (
        <input
          type="text"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="font-poppins text-lg flex-grow p-2 border rounded"
        />
      ) : (
        <p className="font-poppins text-lg">{todo.todo}</p>
      )}
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              className="p-1 bg-green-200 rounded transition-transform transform hover:scale-125"
              onClick={() => saveEdit(todo._id)}
            >
              Save
            </button>
            <button
              className="p-1 bg-gray-200 rounded transition-transform transform hover:scale-125"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="p-1 bg-blue-200 rounded transition-transform transform hover:scale-125"
              onClick={() => setIsEditing(true)}
            >
              ✏️
            </button>
            <button
              className="p-1 bg-gray-200 rounded transition-transform transform hover:scale-125"
              onClick={() => updateTodo(todo._id, todo.status)}
            >
              {todo.status ? (
                "✅"
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5f6368"
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" />
                </svg>
              )}
            </button>
            <button
              className="p-1 bg-red-200 rounded transition-transform transform hover:scale-125"
              onClick={() => deleteTodo(todo._id)}
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Todo;
