import { json } from "express";
import { pool } from "../db.js";

async function getSeccs(req, res) {
  try {
    const [result] = await pool.query(
      "SELECT * FROM secciones"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function getoneSecc(req, res) {
  try {
    const [result] = await pool.query(
      "SELECT * FROM secciones WHERE seccion_id = ?",
      req.params.id
    );
    if (result.length === 0) {
      return res.status(403).json({ Message: "Seccion not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createSecc(req, res) {
  try {
    const { seccion_name } = req.body;
    const [result] = await pool.query(
      "INSERT INTO secciones (seccion_name) VALUES (?)",
      [seccion_name]
    );
    res.json({
      id: result.insertId,
      message: `Seccion creada exitosamente`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateSecc(req, res) {
  try {
    const [result] = await pool.query(
      "UPDATE secciones SET ? WHERE seccion_id = ?",
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

async function deleteSecc(req, res) {
  try {
    const [result] = await pool.query(
      "DELETE FROM secciones WHERE seccion_id = ?",
      req.params.id
    );
    if (result.affectedRows === 0)
      return res.status(403).json({ message: "Seccion no encontrada" });
    return res.status(204).json({ message: "Seccion eliminada exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  getSeccs,
  getoneSecc,
  createSecc,
  uptadateSecc,
  deleteSecc,
};
