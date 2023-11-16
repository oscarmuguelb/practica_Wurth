const express = require("express");
const routes = express.Router();

routes.post("/login", (req, res) => {
  const { correo, contrasenia } = req.body;
  console.log(correo, contrasenia);
  req.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send(err);
    }
    conn.query(
      "SELECT id FROM usuario WHERE correo = ? AND contrasenia = ?",
      [correo, contrasenia],
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        if (rows.length > 0) {
          res.status(200).json(rows);
        } else {
          res.status(401).send("Credenciales inválidas");
        }
      }
    );
  });
});
// nueva base de datos:
// create table persona(
//   id INT NOT NULL AUTO_INCREMENT primary key,
//   nombre varchar(45),
//   primer_apellido varchar(45),
//   segundo_apellido varchar(45),
//   fecha_nacimiento date
//   );

//   create table usuario(
//   id INT NOT NULL AUTO_INCREMENT primary key,
//   correo varchar(45),
//   contrasenia varchar(45),
//   persona_id INT,
//   FOREIGN KEY (persona_id) REFERENCES persona(id)
//   );
routes.post("/registro", (req, res) => {
  const { nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo, contrasenia } = req.body;
  const personaData = { nombre, primer_apellido, segundo_apellido, fecha_nacimiento };
  const usuarioData = { correo, contrasenia };
  
  console.log(personaData, usuarioData);
  req.getConnection((err, conn) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error en el servidor");
    }
    conn.query(
      "SELECT * FROM usuario WHERE correo = ?",
      [correo],
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error en el servidor");
        }
        if (rows.length > 0) {
          return res.status(400).send("El correo ya está en uso");
        }
        conn.query("INSERT INTO persona SET ?", [personaData], (err, rows) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor");
          }
          usuarioData.persona_id = rows.insertId;
          conn.query("INSERT INTO usuario SET ?", [usuarioData], (err, rows) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Error en el servidor");
            }
            res.status(200).send("Usuario registrado");
          });
        });
      }
    );
  });
});

routes.get("/usuarios", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error en el servidor");
    }
    conn.query(
      "SELECT p.id, p.nombre, p.primer_apellido, p.segundo_apellido,p.fecha_nacimiento, u.correo, u.contrasenia FROM persona p JOIN usuario u ON u.persona_id = p.id",
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error en el servidor");
        }
        res.json(rows);
      }
    );
  });
});
routes.delete("/usuarios/:id", (req, res) => {
  req.getConnection((err, conn) => {
    conn.query(
      "DELETE FROM usuario WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error en el servidor");
        }
        res.json(rows);
      }
    );
  }
  );
}
);
routes.put("/usuarios/:id", (req, res) => {
  const { nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo, contrasenia } = req.body;
  const personaData = { nombre, primer_apellido, segundo_apellido, fecha_nacimiento };
  const usuarioData = { correo, contrasenia };
  const id = req.params.id;
  
  console.log(personaData, usuarioData);
  req.getConnection((err, conn) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error en el servidor");
    }

    // Verificar si el correo ya está en uso por otro usuario
    conn.query(
      "SELECT * FROM usuario WHERE correo = ? AND persona_id != ?",
      [correo, id],
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error en el servidor");
        }
        if (rows.length > 0) {
          return res.status(400).send("El correo ya está en uso por otro usuario");
        }

        // Actualizar los datos de la persona
        conn.query("UPDATE persona SET ? WHERE id = ?", [personaData, id], (err, rows) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor");
          }

          // Actualizar los datos del usuario
          conn.query("UPDATE usuario SET ? WHERE persona_id = ?", [usuarioData, id], (err, rows) => {
            if (err) {
              console.log(err);
              return res.status(500).send("Error en el servidor");
            }
            res.status(200).send("Usuario actualizado");
          });
        });
      }
    );
  });
});


// traer todos los productos y el nombre de su categoria
// create table producto(
//   id INT NOT NULL AUTO_INCREMENT primary key,
//   nombre varchar(45),
//   precio double,
//   existencias int,
//   categorias_id int,
//   fecha_registro DATETIME,
//   usuario_registro INT,
//   FOREIGN key (categorias_id) REFERENCES  categoria(id),
//   FOREIGN key (usuario_registro) REFERENCES  usuario(id)
//   );
  
  // create table categoria(
  // id INT NOT NULL AUTO_INCREMENT primary key,
  // nombre varchar(45)
  // );

routes.get("/categorias", (req, res) => {
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM categoria", (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error en el servidor");
      }
      res.json(rows);
    });
  });
});

routes.post("/productos", (req, res) => {
  const productoData = req.body;
  console.log(productoData);
  req.getConnection((err, conn) => {
    conn.query(
      "INSERT INTO producto SET ?",
      [productoData],
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error en el servidor");
        }
        res.status(200).send("Producto registrado");
      }
    );  
  });
});


routes.get("/productos", (req, res) => {
  req.getConnection((err, conn) => {
    conn.query(
      "SELECT p.id, p.nombre, p.precio, p.existencias,p.usuario_registro,p.fecha_registro, c.nombre as categoria FROM producto p INNER JOIN categoria c ON p.categoria_id = c.id",
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error en el servidor");
        }
        res.json(rows);
      }
    );
  }
  );
}
);

routes.delete("/productos/:id", (req, res) => {
  req.getConnection((err, conn) => {
    conn.query(
      "DELETE FROM producto WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error en el servidor");
        }
        res.json(rows);
      }
    );
  }
  );
}
);

routes.put("/productos/:id", (req, res) => {
  console.log(req.body);
  req.getConnection((err, conn) => {
    conn.query(
      "UPDATE producto SET ? WHERE id = ?",
      [req.body, req.params.id],
      (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error en el servidor");
        }
        res.json(rows);
      }
    );
  }
  );
}   
);

    
//va al final xd
module.exports = routes;
