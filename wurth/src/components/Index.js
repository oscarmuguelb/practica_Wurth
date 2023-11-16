import React, { useEffect, useState } from "react";
import baseUrl from "../routes/BaseUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

function Index() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [productoId, setProductoId] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      const response = await fetch(`${baseUrl}/productos`);
      const data = await response.json();
      const response2 = await fetch(`${baseUrl}/categorias`);
      const data2 = await response2.json();
      setProductos(data);
      setCategorias(data2);
    };
    obtenerProductos();
  }, []);

  const eliminarProducto = async (id) => {
    const response = await fetch(`${baseUrl}/productos/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setProductos(productos.filter((producto) => producto.id !== id));
    }
  };

  const crearProducto = async (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById("createForm"));
    const userData = Object.fromEntries(formData.entries());
    userData.usuario_registro = Cookies.get("usuarioId"); 
    try {
      await axios.post(`${baseUrl}/productos`, userData);
      setShowModal(false); 
      Swal.fire({
        icon: "success",
        title: "¡Producto creado!",
        text: "Se ha creado tu producto correctamente",
      });
      window.location.href = "/Index";
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Ha ocurrido un error al crear el producto. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const editarProducto = async (id) => {
    const formElement = document.getElementById("editForm");
    const formData = new FormData(formElement);
    const userData = Object.fromEntries(formData.entries());
    userData.usuario_registro = Cookies.get("usuarioId");
    try {
      await axios.put(`${baseUrl}/productos/${id}`, userData);
      setShowModalEdit(false);
      Swal.fire({
        icon: "success",
        title: "¡Producto editado!",
        text: "Se ha editado tu producto correctamente",
      });
      window.location.href = "/Index";
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Ha ocurrido un error al editar el producto. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("es-ES");
    return formattedDate;
  };

  return (
    <div className="container">
      <h1>Productos</h1>
      <button className="createB" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <table className="tableView">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Existencias</th>
            <th>Categoría</th>
            <th>Registrado por</th>
            <th>Fecha de registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>${producto.precio.toFixed(2)} mx</td>
              <td>{producto.existencias}</td>
              <td>{producto.categoria}</td>
              <td>{producto.usuario_registro}</td>
              <td>{formatDate(producto.fecha_registro)}</td>
              <td>
                <button
                  className="editB"
                  onClick={() => {
                    setShowModalEdit(true);
                    setProductoId(producto.id);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="deleteB"
                  onClick={() => eliminarProducto(producto.id)}
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
            <label className="formLabel" name="precio">
              Precio
            </label>
            <input className="formInput" name="precio" type="text" />
            <label className="formLabel" name="existencias">
              Existencias
            </label>
            <input className="formInput" name="existencias" type="text" />
            <label className="formLabel" name="categoria">
              Categoría
            </label>
            <select className="formInput" name="categoria_id">
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={crearProducto}>
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
            <label className="formLabel" name="precio">
              Precio
            </label>
            <input className="formInput" name="precio" type="text" />
            <label className="formLabel" name="existencias">
              Existencias
            </label>
            <input className="formInput" name="existencias" type="text" />
            <label className="formLabel" name="categoria">
              Categoría
            </label>
            <select className="formInput" name="categoria_id">
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary"
            onClick={() => editarProducto(productoId)}
          >
            Editar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Index;
