import React from "react";
import "../index.css";
import baseUrl from "../routes/BaseUrl";
import Logo from "../img/logo.png";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
function Login() {
  const [form, setForm] = React.useState({
    correo: "",
    contrasenia: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const IniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        correo: form.correo,
        contrasenia: form.contrasenia,
      });

      if (response.status === 200) {
        const usuarioId = response.data[0].id; // Asumiendo que el ID está en la posición 0 del array
        Cookies.set("usuarioId", usuarioId, { expires: 1 }); // Guarda el ID en las cookies
        console.log("ID del usuario:", usuarioId);
        Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
        });

        window.location.href = "/Index";
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Correo o contraseña incorrectos",
      });
    }
  };
  return (
    <div id="Login">
      <div className="formCube">
        <div className="logoSpace">
          <img id="logoLogin" src={Logo} alt="Logo" />
        </div>
        <h2>Bienvenido a Würth</h2>
        <form className="form" onSubmit={IniciarSesion}>
          <label className="formLabel">Correo</label>
          <input
            className="formInput"
            required
            name="correo"
            type="text"
            onChange={handleChange}
          />
          <label className="formLabel">Contraseña</label>
          <input
            className="formInput"
            required
            name="contrasenia"
            type="password"
            onChange={handleChange}
          />
          <button className="formButton" type="submit">
            Iniciar Sesión
          </button>
          <div className="formLink">
            <a id="toCrearCuenta" href="/CreateAccount">
              ¿No tienes cuenta?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;

