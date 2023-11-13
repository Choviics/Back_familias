import { json } from "express";
import { pool } from "../db.js";

async function getConvenios(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(
        "SELECT name, seccion, ruta_logo, descripcion FROM convenio"
      );
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function getoneConvenio(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(
        "SELECT * FROM convenio WHERE convenio_id = ?",
        req.params.id
      );
      if (result.length === 0) {
        return res.status(403).json({ Message: "Convenio not found" });
      } else {
        res.json(result[0]);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createConvenio(req, res) {
  try {
    if (req.session.user.es_admin) {
      const { name, seccion, ruta_logo, descripcion } = req.body;
      const [result] = await pool.promise().query(
        "INSERT INTO convenio (name, seccion, created_by, ruta_logo, descripcion) VALUES (?, ?, ?, ?, ?)",
        [name, seccion, req.session.user.user_id, ruta_logo, descripcion]
      );
      res.json({
        id: result.insertId,
        message: `Convenio creado exitosamente`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateConvenio(req, res) {
  try {
    if (req.session.user.es_admin) {
      const [result] = await pool.promise().query(
        "UPDATE convenio SET ? WHERE convenio_id = ?",
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

async function deleteConvenio(req, res) {
  try {
    if (req.session.user.es_admin) {
      const [result] = await pool.promise().query(
        "DELETE FROM convenio WHERE convenio_id = ?",
        req.params.id
      );
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Convenio no encontrado" });
      return res
        .status(204)
        .json({ message: "Convenio eliminada exitosamente" });
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

//FILTRAR LOS CONVENIOS POR SECCION

async function getFilterConv(req, res) {
  try {
    if (req.session.authenticated) {
      const [result] = await pool.promise().query(
        "SELECT * FROM convenio WHERE seccion = ?",
        req.params.id
      );
      if (result.length === 0) {
        return res.status(403).json({ Message: "Secciones no encontradas" });
      } else {
        res.json(result);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  getConvenios,
  getoneConvenio,
  createConvenio,
  uptadateConvenio,
  deleteConvenio,
  getFilterConv,
};
