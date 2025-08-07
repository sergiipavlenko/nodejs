import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import UserDetail from "./pages/UserDetail";
import LoginForm from "./pages/LoginForm/index";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm  onLogin={() => {}}/>} />
        <Route path="/home" element={<Navigate to={"/"} />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
