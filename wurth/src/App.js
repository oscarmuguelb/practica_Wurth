// Archivo App.js

import "./App.css";
import Index from "./components/Index";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import CreateAccount from "./components/CreateAccount";
import Users from "./components/Users";
// Tienda

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/Index" element={<Layout><Index/></Layout>} />
        <Route path="/Users" element={<Layout><Users/></Layout>} />
      </Routes>
    </div>
  );
}

export default App;
