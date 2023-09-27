import { json } from "express";
import { pool } from "../db.js";

async function getUsers(req, res) {
  try {
    const [result] = await pool.query("SELECT * FROM user");
    res.json(result);
  } catch (error) {
    return res.status(500).json({message: console.error.message});
  }
}

async function getoneUser(req, res) {
  try {
    const [result] = await pool.query(
      "SELECT * FROM user WHERE id = ?",
      req.params.id
    );
    if (result.length === 0) {
      return res.status(404).json({Message: "User not found"});
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({message: console.error.message});
  }
}

async function createUsers(req, res) {
  try {
    const {
      nombres,
      apellidos,
      rut,
      username,
      email,
      password,
      es_admin,
      direccion,
      telefono,
      avatar_img,
    } = req.body;
    const [result] = await pool.query(
      "INSERT INTO user (nombres, apellidos, rut, username, email, password, es_admin, direccion, telefono, avatar_img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombres,
        apellidos,
        rut,
        username,
        email,
        password,
        es_admin,
        direccion,
        telefono,
        avatar_img,
      ]
    );
    res.json({
      id: result.insertId,
      message: `Usuario creado exitosamente`,
    });
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}

async function uptadateUsers(req, res) {
  try {
    const [result] = await pool.query("UPDATE user SET ? WHERE id = ?", [
      req.body,
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "No se actualizo ningún dato" });
    res.json(result);
  } catch (error) {
    return res.status(500).json({message: console.error.message});
  }
}

async function deleteUsers(req, res) {
  try {
    const [result] = await pool.query(
      "DELETE FROM user WHERE id = ?",
      req.params.id
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });
    return res.status(204).json({message: "Usuario eliminado exitosamente"});
  } catch (error) {
    return res.status(500).json({message: console.error.message});
  }
}

export default {
  getUsers,
  getoneUser,
  createUsers,
  uptadateUsers,
  deleteUsers,
};
