import { json } from "express";
import { pool } from "../db.js";

async function getLogros(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(
        "SELECT logro_id, titulo, ruta_imagen, descripcion FROM logros"
      );
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function getoneLogro(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(
        "SELECT * FROM logros WHERE logro_id = ?",
        req.params.id
      );
      if (result.length === 0) {
        return res.status(403).json({ Message: "Logro not found" });
      } else {
        const [comments] = await pool.promise().query(
          "SELECT lc.*, u.id, u.username, u.avatar_img FROM logros_coments lc JOIN user u ON lc.user_id = u.id WHERE lc.logro_id = ?",
          req.params.id
        );
        result.push(...comments);
        res.json(result);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createLogro(req, res) {
  try {
    if (req.session.authenticated) {
      const { titulo, ruta_imagen, descripcion } = req.body;
      const [result] = await pool.promise().query(
        "INSERT INTO logros (titulo, ruta_imagen, descripcion, created_by) VALUES (?, ?, ?, ?)",
        [titulo, ruta_imagen, descripcion, req.session.user.user_id]
      );
      res.json({
        id: result.insertId,
        message: `logro creado exitosamente`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateLogro(req, res) {
  try {
    const [post] = await pool.promise().query(
      "SELECT created_by FROM logros WHERE logro_id = ?",
      [req.params.id]
    );
    if (
      req.session.user.user_id == post[0].created_by ||
      req.session.user.es_admin
    ) {
      const [result] = await pool.promise().query(
        "UPDATE logros SET ? WHERE logro_id = ?",
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

async function deleteLogro(req, res) {
  try {
    const [post] = await pool.promise().query(
      "SELECT created_by FROM logros WHERE logro_id = ?",
      [req.params.id]
    );
    if (
      req.session.user.user_id == post[0].created_by ||
      req.session.user.es_admin
    ) {
      await pool.promise().query(
        "DELETE FROM logros_coments WHERE logro_id = ?",
        req.params.id
      );
      const [result] = await pool.promise().query(
        "DELETE FROM logros WHERE logro_id = ?",
        req.params.id
      );
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Logro no encontrado" });
      return res.status(204).json({ message: "Logro eliminado exitosamente" });
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  getLogros,
  getoneLogro,
  createLogro,
  uptadateLogro,
  deleteLogro,
};
