import { json } from "express";
import { pool } from "../db.js";

async function getLogros(req, res) {
  try {
    const [result] = await pool.query(
      "SELECT logro_id, titulo, ruta_imagen, descripcion FROM logros"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function getoneLogro(req, res) {
  try {
    const [result] = await pool.query(
      "SELECT * FROM logros WHERE logro_id = ?",
      req.params.id
    );
    if (result.length === 0) {
      return res.status(404).json({ Message: "Logro not found" });
    } else {
      const [comments] = await pool.query(
        "SELECT lc.*, u.id, u.username, u.avatar_img FROM logros_coments lc JOIN user u ON lc.user_id = u.id WHERE lc.logro_id = ?",
        req.params.id
      );
      result.push(...comments);
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createLogro(req, res) {
  try {
    const { titulo, ruta_imagen, descripcion, created_by } = req.body;
    const [result] = await pool.query(
      "INSERT INTO logros (titulo, ruta_imagen, descripcion, created_by) VALUES (?, ?, ?, ?)",
      [titulo, ruta_imagen, descripcion, created_by]
    );
    res.json({
      id: result.insertId,
      message: `logro creado exitosamente`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateLogro(req, res) {
  try {
    const [result] = await pool.query(
      "UPDATE logros SET ? WHERE logro_id = ?",
      [req.body, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "No se actualizo ningún dato" });
    res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: console.error.message });
  }
}

async function deleteLogro(req, res) {
  try {
    await pool.query(
      "DELETE FROM logros_coments WHERE logro_id = ?",
      req.params.id
    );
    const [result] = await pool.query(
      "DELETE FROM logros WHERE logro_id = ?",
      req.params.id
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Logro no encontrado" });
    return res.status(204).json({ message: "Logro eliminado exitosamente" });
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
