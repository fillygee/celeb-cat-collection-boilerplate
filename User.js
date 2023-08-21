const db = require("../db/db");

class User {
  constructor(username, password, isAdmin) {
    this.username = username;
    this.password = password;
    this.isAdmin = isAdmin;
  }

  static getAllUsers = async () => {
    return await db.query("SELECT * FROM user_account;");
  };

  static getById = async (id) => {
    return await db.query("SELECT * FROM user_account WHERE id = $1", [id]);
  };

  static async create(data) {
    const { username, password, isAdmin } = data;
    let response = await db.query(
      "INSERT INTO user_account (username, password, is_Admin) VALUES ($1, $2, $3) RETURNING id",
      [username, password, isAdmin]
    );
    const newId = response.rows[0].id;
    const newUser = await User.getOneById(newId);
    return newUser;
  }

  static async getOneById(id) {
    const response = await db.query(
      "SELECT * FROM user_account WHERE id = $1",
      [id]
    );
    if (response.rows.length != 1) {
      throw new Error("Unable to locate user.");
    }
    return new User(response.rows[0]);
  }

  static delete = async (id) => {
    await db.query("DELETE FROM user_account WHERE id = $1", [id]);

    return await this.getAllUsers();
  };

  static async getOneByUsername(username) {
    const response = await db.query(
      "SELECT * FROM user_account WHERE username = $1",
      [username]
    );
    if (response.rows.length != 1) {
      throw new Error("Unable to locate user.");
    }
    return new User(response.rows[0].username, response.rows[0].password);
  }
}

module.exports = User;
