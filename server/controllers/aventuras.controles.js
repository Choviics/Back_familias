import { json } from "express";
import { pool } from "../db.js";

async function getAventuras(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(`
      SELECT
      a.aventura_id, a.titulo, a.ruta_imagen, a.fecha, maximo,
      (SELECT COUNT(*) FROM user_aventura ua WHERE ua.aventura_id = a.aventura_id) AS participantes
      FROM aventuras a`);
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function getoneAventura(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(
        `
      SELECT
      a.*,
      (SELECT COUNT(*) FROM user_aventura ua WHERE ua.aventura_id = a.aventura_id) AS contador_usuarios
      FROM aventuras a
      WHERE a.aventura_id = ?`,
        req.params.id
      );
      if (result.length === 0) {
        return res.status(403).json({ Message: "Aventura not found" });
      } else {
        res.json(result[0]);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createAventura(req, res) {
  try {
    if (req.session.authenticated) {
      const {
        titulo,
        ruta_imagen,
        maximo,
        fecha,
        descripcion,
        direccion,
      } = req.body;
      const [result] = await pool.promise().query(
        "INSERT INTO aventuras (titulo, ruta_imagen, created_by, maximo, fecha, descripcion, direccion) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [titulo, ruta_imagen, req.session.user.user_id, maximo, fecha, descripcion, direccion]
      );
      res.json({
        id: result.insertId,
        message: `Aventura creada exitosamente`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateAventura(req, res) {
  try {
    const [post] = await pool.promise().query(
      "SELECT created_by FROM aventuras WHERE aventura_id = ?",
      [req.params.id]
    );
    if (
      req.session.user.user_id == post[0].created_by ||
      req.session.user.es_admin
    ) {
      const [result] = await pool.promise().query(
        "UPDATE aventuras SET ? WHERE aventura_id = ?",
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

async function deleteAventura(req, res) {
  try {
    const [post] = await pool.promise().query(
      "SELECT created_by FROM aventuras WHERE aventura_id = ?",
      [req.params.id]
    );
    if (
      req.session.user.user_id == post[0].created_by ||
      req.session.user.es_admin
    ) {
      await pool.promise().query(
        "DELETE FROM user_aventura WHERE aventura_id = ?",
        req.params.id
      );
      const [result] = await pool.promise().query(
        "DELETE FROM aventuras WHERE aventura_id = ?",
        req.params.id
      );
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Aventura no encontrada" });
      return res
        .status(204)
        .json({ message: "Aventura eliminada exitosamente" });
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  getAventuras,
  getoneAventura,
  createAventura,
  uptadateAventura,
  deleteAventura,
};
