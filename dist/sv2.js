"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const db_1 = require("./database/db");
const app = (0, express_1.default)();
const port = config_1.default.port;
// parser
app.use(express_1.default.json());
// app.use(express.urlencoded());
// initializing DB
(0, db_1.initDB)();
// logger middleware
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
    next();
};
app.get("/", logger, (req, res) => {
    res.send("Hello Next Level Developers!");
});
//users CRUD
app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await db_1.pool.query(`INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`, [name, email]);
        // console.log(result.rows[0]);
        res.status(201).json({
            success: false,
            message: "Data Instered Successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
// users Crud
app.get("/users", async (req, res) => {
    try {
        const result = await db_1.pool.query(`SELECT * FROM users`);
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            datails: err,
        });
    }
});
app.get("/users/:id", async (req, res) => {
    // console.log(req.params.id);
    try {
        const result = await db_1.pool.query(`SELECT * FROM users WHERE id = $1`, [
            req.params.id,
        ]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: result.rows[0],
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
app.put("/users/:id", async (req, res) => {
    // console.log(req.params.id);
    const { name, email } = req.body;
    try {
        const result = await db_1.pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, req.params.id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result.rows[0],
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
app.delete("/users/:id", async (req, res) => {
    // console.log(req.params.id);
    try {
        const result = await db_1.pool.query(`DELETE FROM users WHERE id = $1`, [
            req.params.id,
        ]);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: result.rows,
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
// todos crud
app.post("/todos", async (req, res) => {
    const { user_id, title } = req.body;
    try {
        const result = await db_1.pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title]);
        res.status(201).json({
            success: true,
            message: "Todo created",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
app.get("/todos", async (req, res) => {
    try {
        const result = await db_1.pool.query(`SELECT * FROM todos`);
        res.status(200).json({
            success: true,
            message: "todos retrieved successfully",
            data: result.rows,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            datails: err,
        });
    }
});
// Get single todo
app.get("/todos/:id", async (req, res) => {
    try {
        const result = await db_1.pool.query("SELECT * FROM todos WHERE id = $1", [
            req.params.id,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch todo" });
    }
});
// Update todo
app.put("/todos/:id", async (req, res) => {
    const { title, completed } = req.body;
    try {
        const result = await db_1.pool.query("UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *", [title, completed, req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update todo" });
    }
});
// Delete todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const result = await db_1.pool.query("DELETE FROM todos WHERE id=$1 RETURNING *", [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json({ success: true, message: "Todo deleted", data: null });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
