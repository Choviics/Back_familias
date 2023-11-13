import { json } from "express";
import { pool } from "../db.js";

async function getUsersAventura(req, res) {
  try {
    if(req.session.authenticated){
      const [result] = await pool.promise().query(
        `
      SELECT ua.*, u.username, u.avatar_img
      FROM user_aventura ua
      JOIN user u ON ua.user_id = u.id
      WHERE ua.aventura_id = ?`,
        req.params.aventura_id
      );
      if (result.length === 0) {
        return res.status(403).json({ Message: "Not found" });
      } else {
        return res.json(result);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

async function createUserAventura(req, res) {
  try {
    if(req.session.authenticated){
      const [existe] = await pool.promise().query(
        `
      SELECT *
      FROM user_aventura
      WHERE user_id = ? AND aventura_id = ?;    
      `,
        [req.session.user.user_id, req.params.aventura_id]
      );
      if (existe.length > 0) {
        return res.json({ message: "Usuario ya se encuentra en la aventura" });
      } else {
        const [result] = await pool.promise().query(
          "INSERT INTO user_aventura (user_id, aventura_id) VALUES (?, ?)",
          [req.session.user.user_id, req.params.aventura_id]
        );
        return res.json({
          id: result.insertId,
          message: `Unido a la aventura exitosamente`,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteUserAventura(req, res) {
  try {
    if(req.session.authenticated){
      const [result] = await pool.promise().query(
        "DELETE FROM user_aventura WHERE user_id = ? AND aventura_id = ?",
        [req.session.user.user_id, req.params.aventura_id]
      );
      if (result.affectedRows === 0) {
        return res.status(403).json({ message: "No encontrado" });
      } else {
        return res.status(200).json({ message: "Eliminado exitosamente" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: console.error.message });
  }
}

export default {
  getUsersAventura,
  createUserAventura,
  deleteUserAventura,
};
