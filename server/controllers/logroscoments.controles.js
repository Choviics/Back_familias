import { json } from "express";
import { pool } from "../db.js";

async function createLogroComent(req, res) {
  try {
    const { logro_id, user_id, contenido } = req.body;
    const [result] = await pool.query(
      "INSERT INTO logros_coments (logro_id, user_id, contenido, fecha) VALUES (?, ?, ?, NOW())",
      [logro_id, user_id, contenido]
    );
    res.json({
      id: result.insertId,
      message: `Comentario creado exitosamente`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateLogroComent(req, res) {
  try {
    const [result] = await pool.query(
      "UPDATE logros_coments SET ? WHERE coment_id = ?",
      [req.body, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "No se actualizo ningún dato" });
    res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: console.error.message });
  }
}

async function deleteLogroComent(req, res) {
  try {
    const [result] = await pool.query(
      "DELETE FROM logros_coments WHERE coment_id = ?",
      req.params.id
    );
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "Comentario no encontrado" });
    return res
      .status(204)
      .json({ message: "Comentario eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  createLogroComent,
  uptadateLogroComent,
  deleteLogroComent,
};
