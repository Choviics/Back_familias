import { json } from "express";
import { pool } from "../db.js";

async function getNews(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(
        "SELECT noticia_id, name, fecha, ruta_imagen FROM noticias"
      );
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function getoneNew(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(
        "SELECT * FROM noticias WHERE noticia_id = ?",
        req.params.id
      );
      if (result.length === 0) {
        return res.status(403).json({ Message: "Noticia not found" });
      } else {
        res.json(result[0]);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createNew(req, res) {
  try {
    if (req.session.user.es_admin) {
      const { name, ruta_imagen, descripcion } = req.body;
      const [result] = await pool.promise().query(
        "INSERT INTO noticias (name, fecha, ruta_imagen, descripcion, created_by) VALUES (?, NOW(), ?, ?, ?)",
        [name, ruta_imagen, descripcion, req.session.user.user_id]
      );
      res.json({
        id: result.insertId,
        message: `Noticia creada exitosamente`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateNews(req, res) {
  try {
    if (req.session.user.es_admin) {
      const [result] = await pool.promise().query(
        "UPDATE noticias SET ? WHERE noticia_id = ?",
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

async function deleteNew(req, res) {
  try {
    if (req.session.user.es_admin) {
      const [result] = await pool.promise().query(
        "DELETE FROM noticias WHERE noticia_id = ?",
        req.params.id
      );
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Noticia no encontrada" });
      res.json({ message: "Noticia eliminada exitosamente" });
    }
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
