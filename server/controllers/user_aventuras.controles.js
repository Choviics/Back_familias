import { json } from "express";
import { pool } from "../db.js";

async function getUsersAventura(req, res) {
  try {
    const [result] = await pool.query(
      `
    SELECT ua.*, u.username, u.avatar_img
    FROM user_aventura ua
    JOIN user u ON ua.user_id = u.id
    WHERE ua.aventura_id = ?`,
      req.params.aventura_id
    );
    if (result.length === 0) {
      return res.status(404).json({ Message: "Not found" });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createUserAventura(req, res) {
  try {
    const [existe] = await pool.query(
      `
    SELECT *
    FROM user_aventura
    WHERE user_id = ? AND aventura_id = ?;    
    `,
      [req.params.user_id, req.params.aventura_id]
    );
    if (existe.length > 0) {
      res.json({ message: "Usuario ya se encuentra en la aventura" });
    } else {
      const [result] = await pool.query(
        "INSERT INTO user_aventura (user_id, aventura_id) VALUES (?, ?)",
        [req.params.user_id, req.params.aventura_id]
      );
      res.json({
        id: result.insertId,
        message: `Unido a la aventura exitosamente`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function uptadateUserAventura(req, res) {
  try {
    const [result] = await pool.query(
      "UPDATE user_aventura SET ? WHERE user_aventura_id = ?",
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

async function deleteUserAventura(req, res) {
  try {
    const [result] = await pool.query(
      "DELETE FROM user_aventura WHERE user_id = ? AND aventura_id = ?",
      [req.params.user_id, req.params.aventura_id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "No encontrado" });
    return res.status(204).json({ message: "Eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  getUsersAventura,
  createUserAventura,
  uptadateUserAventura,
  deleteUserAventura,
};
