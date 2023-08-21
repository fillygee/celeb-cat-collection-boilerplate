const { v4: uuidv4 } = require("uuid");

const db = require("../db/db");

class Token {
  constructor({ token_id, username, token }) {
    this.token_id = token_id;
    this.username = username;
    this.token = token;
  }

  static async create(username) {
    const token = uuidv4();
    const response = await db.query(
      "INSERT INTO token (username, token) VALUES ($1, $2) RETURNING token_id;",
      [username, token]
    );
    const newId = response.rows[0].token_id;
    const newToken = await Token.getOneById(newId);
    return newToken;
  }

  static async getOneById(id) {
    const response = await db.query("SELECT * FROM token WHERE token_id = $1", [
      id,
    ]);
    if (response.rows.length != 1) {
      throw new Error("Unable to locate token.");
    } else {
      return new Token(response.rows[0]);
    }
  }

  static async getOneByToken(token) {
    const response = await db.query("SELECT * FROM token WHERE token = $1", [
      token,
    ]);
    if (response.rows.length != 1) {
      throw new Error("Unable to locate token.");
    } else {
      return new Token(response.rows[0]);
    }
  }

  static async deleteByToken(token){
    await db.query("DELETE FROM token WHERE token = $1", [token]);
  }
}

module.exports = Token;
