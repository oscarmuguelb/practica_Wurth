import React, { useEffect, useState } from "react";
import baseUrl from "../routes/BaseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import axios from "axios";

function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      const response = await fetch(`${baseUrl}/usuarios`);
      const data = await response.json();
      setUsuarios(data);
    };
    obtenerUsuarios();
  }, []);

  const eliminarUsuario = async (id) => {
    const response = await fetch(`${baseUrl}/usuarios/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    }
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById("createForm"));
    const userData = Object.fromEntries(formData.entries());
    if (userData.contrasenia.length < 6) {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
    try {
      await axios.post(`${baseUrl}/registro`, userData);
      setShowModal(false);
      Swal.fire({
        icon: "success",
        title: "¡Usuario creado!",
        text: "Se ha creado tu usuario correctamente",
      });
      window.location.href = "/Users";
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Ha ocurrido un error al crear el usuario. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const editarUsuario = async (id) => {
    const formElement = document.getElementById("editForm");
    const formData = new FormData(formElement);
    const userData = Object.fromEntries(formData.entries());
    if (userData.contrasenia.length < 6) {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
    try {
      await axios.put(`${baseUrl}/usuarios/${id}`, userData);
      setShowModalEdit(false);
      Swal.fire({
        icon: "success",
        title: "¡Usuario editado!",
        text: "Se ha editado tu usuario correctamente",
      });
      window.location.href = "/Users";
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Ha ocurrido un error al editar el usuario. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(date).toLocaleDateString("es-ES", options);
    return formattedDate;
  };

  return (
    <div className="container">
      <h1>Usuarios</h1>
      <button className="createB" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <table className="tableView">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Primer Apellido</th>
            <th>Segundo Apellido</th>
            <th>Correo</th>
            <th>Contraseña</th>
            <th>Cumpleaños</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.primer_apellido}</td>
              <td>{usuario.segundo_apellido}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.contrasenia}</td>
              <td>{formatDate(usuario.fecha_nacimiento)}</td>
              <td>
                <button
                  className="editB"
                  onClick={() => {
                    setShowModalEdit(true);
                    setUsuarioId(usuario.id);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="deleteB"
                  onClick={() => eliminarUsuario(usuario.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalForm">
          <form id="createForm" className="form">
            <label className="formLabel" name="nombre">
              Nombre
            </label>
            <input className="formInput" name="nombre" type="text" />
            <label className="formLabel" name="primer_apellido">
              Primer Apellido
            </label>
            <input className="formInput" name="primer_apellido" type="text" />
            <label className="formLabel" name="segundo_apellido">
              Segundo Apellido
            </label>
            <input className="formInput" name="segundo_apellido" type="text" />
            <label className="formLabel" name="fecha_nacimiento">
              Fecha de nacimiento
            </label>
            <input className="formInput" name="fecha_nacimiento" type="date" />
            <label className="formLabel" name="correo">
              Correo
            </label>
            <input className="formInput" name="correo" type="text" />
            <label className="formLabel" name="contrasenia">
              Contraseña
            </label>
            <input className="formInput" name="contrasenia" type="password" />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={crearUsuario}>
            Crear
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalForm">
          <form id="editForm" className="form">
            <label className="formLabel" name="nombre">
              Nombre
            </label>
            <input className="formInput" name="nombre" type="text" />
            <label className="formLabel" name="primer_apellido">
              Primer Apellido
            </label>
            <input className="formInput" name="primer_apellido" type="text" />
            <label className="formLabel" name="segundo_apellido">
              Segundo Apellido
            </label>
            <input className="formInput" name="segundo_apellido" type="text" />
            <label className="formLabel" name="fecha_nacimiento">
              Fecha de nacimiento
            </label>
            <input className="formInput" name="fecha_nacimiento" type="date" />
            <label className="formLabel" name="correo">
              Correo
            </label>
            <input className="formInput" name="correo" type="text" />
            <label className="formLabel" name="contrasenia">
              Contraseña
            </label>
            <input className="formInput" name="contrasenia" type="password" />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            onClick={() => editarUsuario(usuarioId)}
          >
            Editar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Users;
