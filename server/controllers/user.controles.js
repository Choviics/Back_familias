import { json } from "express";
import { pool } from "../db.js";
import bcrypt from "bcrypt";

async function getUsers(req, res) {
  try {
    if (req.session.user.es_admin) {
      const [result] = await pool.promise().query(
        "SELECT id, avatar_img, nombres, apellidos, rut, username FROM user"
      );
      return res.json(result);
    } else {
      return res.status(404).json({ message: "No tienes permisos" });
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function getoneUser(req, res) {
  try {
    if (req.session.user.es_admin) {
      const [result] = await pool.promise().query(
        "SELECT * FROM user WHERE id = ?",
        req.params.id
      );
      if (result.length === 0) {
        return res.status(403).json({ Message: "User not found" });
      } else {
        res.json(result[0]);
      }
    } else {
      return res.status(404).json({ message: "No tienes permisos" });
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createUsers(req, res) {
  try {
    if (req.session.user.es_admin) {
      const {
        nombres,
        apellidos,
        rut,
        username,
        email,
        password,
        es_admin,
        direccion,
        telefono,
        avatar_img,
      } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hash = bcrypt.hashSync(password, salt);

      const [result] = await pool.promise().query(
        "INSERT INTO user (nombres, apellidos, rut, username, email, password, es_admin, direccion, telefono, avatar_img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          nombres,
          apellidos,
          rut,
          username,
          email,
          hash,
          es_admin,
          direccion,
          telefono,
          avatar_img,
        ]
      );
      res.json({
        id: result.insertId,
        message: `Usuario creado exitosamente`,
      });
    } else {
      return res.status(404).json({ message: "No tienes permisos" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateUsers(req, res) {
  try {
    if (
      req.session.user.es_admin ||
      req.params.id == req.session.user.user_id
    ) {
      const [result] = await pool.promise().query("UPDATE user SET ? WHERE id = ?", [
        req.body,
        req.params.id,
      ]);
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "No se actualizo ningún dato" });
      res.json(result);
    } else {
      return res.status(404).json({ message: "No tienes permisos" });
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function deleteUsers(req, res) {
  try {
    if (req.session.user.es_admin) {
      if (req.params.id == req.session.user.user_id) {
        return res
          .status(403)
          .json({ message: "No puedes eliminarte a ti mismo" });
      }
      const [result] = await pool.promise().query(
        "DELETE FROM user WHERE id = ?",
        req.params.id
      );
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Usuario no encontrado" });
      return res
        .status(204)
        .json({ message: "Usuario eliminado exitosamente" });
    } else {
      return res.status(404).json({ message: "No tienes permisos" });
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (req.session.authenticated) {
      res.json(req.session);
    } else {
      const [result] = await pool.promise().query(
        "SELECT * FROM user WHERE username = ?",
        [username]
      );
      const auth = bcrypt.compareSync(password, result[0].password);
      if (auth) {
        req.session.authenticated = true;
        const user_id = result[0].id;
        const es_admin = result[0].es_admin;
        const avatar_img = result[0].avatar_img;
        req.session.user = {
          user_id,
          username,
          es_admin,
          avatar_img,
        };
        return res.json(req.session);
      } else {
        return res.status(403).json({ message: "Usuario no encontrado" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function logout(req, res) {
  if (req.session.authenticated) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      return res.status(200).json({ message: "Sesión cerrada" }); // Redirige al inicio de sesión después de cerrar la sesión
    });
  } else {
    return res.status(403).json({ message: "Usuario no iniciado" }); // Si el usuario no está autenticado
  }
}

export default {
  getUsers,
  getoneUser,
  createUsers,
  uptadateUsers,
  deleteUsers,
  login,
  logout,
};
