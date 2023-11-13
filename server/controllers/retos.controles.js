import { json } from "express";
import { pool } from "../db.js";

async function getRetos(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(
        "SELECT reto_id, titulo, ruta_imagen, dificultad FROM retos"
      );
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function getoneReto(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(
        "SELECT * FROM retos WHERE reto_id = ?",
        req.params.id
      );
      if (result.length === 0) {
        return res.status(403).json({ Message: "Reto not found" });
      } else {
        const [pasos] = await pool.promise().query(
          "SELECT * FROM pasos WHERE reto_id = ?",
          req.params.id
        );
        const [comentarios] = await pool.promise().query(
          "SELECT rc.*, u.username, u.avatar_img FROM reto_coments rc RIGHT JOIN user u ON rc.user_id = u.id WHERE rc.reto_id = ?",
          req.params.id
        );
        result[0].cantidad_pasos = pasos.length;
        result.push(...pasos, ...comentarios);
        return res.status(200).json(result);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createReto(req, res) {
  try {
    if (req.session.user.es_admin) {
      const { titulo, ruta_imagen, descripcion, dificultad } =
        req.body;
      const [result] = await pool.promise().query(
        "INSERT INTO retos (titulo, ruta_imagen, created_by, fecha, descripcion, dificultad) VALUES (?, ?, ?, NOW(), ?, ?)",
        [titulo, ruta_imagen, req.session.user.user_id, descripcion, dificultad]
      );
      res.json({
        id: result.insertId,
        message: `Reto creado exitosamente`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateReto(req, res) {
  try {
    if (req.session.user.es_admin) {
      const [result] = await pool.promise().query(
        "UPDATE retos SET ? WHERE reto_id = ?",
        [req.body, req.params.id]
      );
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "No se actualizo ningún dato" });
      res.json(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: console.error.message });
  }
}

async function deleteReto(req, res) {
  try {
    if (req.session.user.es_admin) {
      await pool.promise().query("DELETE FROM pasos WHERE reto_id =?", req.params.id);
      await pool.promise().query(
        "DELETE FROM reto_coments WHERE reto_id =?",
        req.params.id
      );
      const [result] = await pool.promise().query(
        "DELETE FROM retos WHERE reto_id =?",
        req.params.id
      );
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Error al eliminar reto" });
      return res.status(204).json({ message: "Reto eliminado exitosamente" });
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  getRetos,
  getoneReto,
  createReto,
  uptadateReto,
  deleteReto,
};
