require("dotenv").config();
const { mysqlPool } = require("../config/db");

async function setup() {
    try {
        await mysqlPool.query(`
            CREATE TABLE IF NOT EXISTS users (
            UserID VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
            name VARCHAR(25) NOT NULL,
            email VARCHAR(25) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
        );
        
        `);
        // await mysqlPool.query(
        //     "UPDATE users SET role = 'admin' WHERE email = ?", 
        //     ['mohamed@gmail.com']
        // );
        console.log("users table created successfully (or already existed)");
    } catch (err) {
        console.error("An error occurred:", err.message);
    } finally {
        await mysqlPool.end();
    }
}
setup();
