import { json } from "express";
import { pool } from "../db.js";

async function createRetoComent(req, res) {
  try {
    if (req.session.authenticated) {
      const { contenido } = req.body;
      const [result] = await pool.promise().query(
        "INSERT INTO reto_coments (reto_id, user_id, contenido, fecha) VALUES (?, ?, ?, NOW())",
        [req.params.aventura_id, req.session.user.user_id, contenido]
      );
      res.json({
        id: result.insertId,
        message: `Comentario creado exitosamente`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateRetoComent(req, res) {
  try {
    const [post] = await pool.promise().query(
      "SELECT user_id FROM reto_coments WHERE coment_id = ?",
      [req.params.id]
    );
    if (
      req.session.user.user_id == post[0].user_id ||
      req.session.user.es_admin
    ) {
      const [result] = await pool.promise().query(
        "UPDATE reto_coments SET ? WHERE coment_id = ?",
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

async function deleteRetoComent(req, res) {
  try {
    const [post] = await pool.promise().query(
      "SELECT user_id FROM reto_coments WHERE coment_id = ?",
      [req.params.id]
    );
    if (
      req.session.user.user_id == post[0].user_id ||
      req.session.user.es_admin
    ) {
      const [result] = await pool.promise().query(
        "DELETE FROM reto_coments WHERE coment_id = ?",
        req.params.id
      );
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Comentario no encontrado" });
      return res
        .status(204)
        .json({ message: "Comentario eliminado exitosamente" });
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  createRetoComent,
  uptadateRetoComent,
  deleteRetoComent,
};
