import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Logo from "../img/logo.png";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBoxOpen, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Layout = ({ children, searchQuery }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioId = Cookies.get("usuarioId");
    if (!usuarioId) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove("usuarioId");
    navigate("/");
  };

  return (
    <div>
      <div id="Layout">
        <img id="logo" src={Logo} alt="Logo" />
        <div id="menu">
          <a href="/Users">
            <FontAwesomeIcon icon={faUsers} />
            Usuarios
          </a>
          <a href="/Index">
            <FontAwesomeIcon icon={faBoxOpen} />
            Inventario
          </a>
          <button id="logout" onClick={handleLogout}>
          Cerrar sesión
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </div>
      <div>{React.cloneElement(children, { searchQuery })}</div>
    </div>
  );
};

export default Layout;
