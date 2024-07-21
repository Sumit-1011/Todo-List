import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import TodoList from "./components/TodoList";
import AuthenticatedRoute from "./components/AuthenticatedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={<AuthenticatedRoute element={<TodoList />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
