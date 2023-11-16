import React from "react";
import baseUrl from "../routes/BaseUrl";
import Logo from "../img/logo.png";
import Swal from "sweetalert2";
import axios from "axios";

function CreateAccount() {
  const Crear = async (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById("createForm"));
    const userData = Object.fromEntries(formData.entries());

    if (userData.contrasenia.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Contraseña demasiado corta",
        text: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    console.log("Datos del usuario:", userData);
    await axios.post(`${baseUrl}/registro`, userData);
    Swal.fire({
      icon: "success",
      title: "¡Cuenta creada!",
      text: "Se ha creado tu cuenta correctamente",
    });
    window.location.href = "/";
  };

  return (
    <div id="Login">
      <div className="formCube">
        <div className="logoSpace">
          <img id="logoLogin" src={Logo} alt="Logo" />
        </div>
        <h2>Registrate</h2>
        <form id="createForm" className="form" onSubmit={Crear}>
          <label className="formLabel">Nombre</label>
          <input className="formInput" name="nombre" type="text" />
          <label className="formLabel">Primer apellido</label>
          <input className="formInput" name="primer_apellido" type="text" />
          <label className="formLabel">Segundo apellido</label>
          <input className="formInput" name="segundo_apellido" type="text" />
          <label className="formLabel">Fecha de nacimiento</label>
          <input className="formInput" name="fecha_nacimiento" type="date" />
          <label className="formLabel">Correo</label>
          <input className="formInput" name="correo" type="text" />
          <label className="formLabel">Contraseña</label>
          <input className="formInput" name="contrasenia" type="password" />
          <button className="formButton" type="submit">
            Crear cuenta
          </button>
          <div className="formLink">
            <a id="toCrearCuenta" href="/">
              ¿Ya tienes cuenta?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
