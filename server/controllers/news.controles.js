import { json } from "express";
import { pool } from "../db.js";

async function getNews(req, res) {
  try {
    const [result] = await pool.query(
      "SELECT noticia_id, name, fecha, ruta_imagen FROM noticias"
    );
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function getoneNew(req, res) {
  try {
    const [result] = await pool.query(
      "SELECT * FROM noticias WHERE noticia_id = ?",
      req.params.id
    );
    if (result.length === 0) {
      return res.status(404).json({ Message: "Noticia not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createNew(req, res) {
  try {
    const { name, fecha, ruta_imagen, descripcion, created_by } = req.body;
    const [result] = await pool.query(
      "INSERT INTO noticias (name, fecha, ruta_imagen, descripcion, created_by) VALUES (?, ?, ?, ?, ?)",
      [name, fecha, ruta_imagen, descripcion, created_by]
    );
    res.json({
      id: result.insertId,
      message: `Noticia creada exitosamente`,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateNews(req, res) {
  try {
    const [result] = await pool.query(
      "UPDATE noticias SET ? WHERE noticia_id = ?",
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

async function deleteNew(req, res) {
  try {
    const [result] = await pool.query(
      "DELETE FROM noticias WHERE noticia_id = ?",
      req.params.id
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Noticia no encontrada" });
    return res.status(204).json({ message: "Noticia eliminada exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  getNews,
  getoneNew,
  createNew,
  uptadateNews,
  deleteNew,
};
