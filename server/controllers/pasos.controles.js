import { json } from "express";
import { pool } from "../db.js";

async function getonePaso(req, res) {
  try {
    const [result] = await pool.query(
      "SELECT * FROM pasos WHERE pasos_id = ?",
      req.params.id
    );
    if (result.length === 0) {
      return res.status(404).json({ Message: "Pasos not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createPaso(req, res) {
  try {
    const { n_paso, contenido, ruta_imagen, reto_id } = req.body;
    const [result] = await pool.query(
      "INSERT INTO pasos (n_paso, contenido, ruta_imagen, reto_id) VALUES (?, ?, ?, ?)",
      [n_paso, contenido, ruta_imagen, reto_id]
    );
    res.json({
      id: result.insertId,
      message: `Paso creado exitosamente`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadatePaso(req, res) {
  try {
    const [result] = await pool.query("UPDATE pasos SET ? WHERE pasos_id = ?", [
      req.body,
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "No se actualizo ningún dato" });
    res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: console.error.message });
  }
}

async function deletePaso(req, res) {
  try {
    const [result] = await pool.query(
      "DELETE FROM pasos WHERE pasos_id = ?",
      req.params.id
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Paso no encontrado" });
    return res.status(204).json({ message: "Paso eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  getonePaso,
  createPaso,
  uptadatePaso,
  deletePaso,
};