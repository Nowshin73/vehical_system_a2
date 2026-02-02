"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const db_1 = require("../../database/db");
const getAllUser = async () => {
    const result = await db_1.pool.query(`
    SELECT id,name,email,phone,role FROM Users
    `);
    return result;
};
const deleteUser = async (userId) => {
    const result = await db_1.pool.query(`DELETE FROM Users WHERE id = $1`, [userId]);
    return result;
};
const getSingleUser = async (id) => {
    const result = await db_1.pool.query(`
    SELECT * FROM Users WHERE id=$1
    `, [id]);
    return result;
};
const getUserById = async (id) => {
    const res = await db_1.pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return res.rows[0] || null;
};
const updateUser = async (payload, id, loggedInUserRole) => {
    const { name, email, phone, role } = payload;
    if (loggedInUserRole === "admin") {
        // Admin can update everything
        const result = await db_1.pool.query(`UPDATE Users 
       SET name=$1, email=$2, phone=$3, role=$4 
       WHERE id=$5 
       RETURNING id,name,email,phone,role`, [name, email, phone, role, id]);
        return result.rows[0];
    }
    // Customer rules
    if (loggedInUserRole === "customer" && role !== undefined && role !== "customer") {
        throw new Error("Customer can't change role");
    }
    const result = await db_1.pool.query(`UPDATE Users 
     SET name=$1, email=$2, phone=$3 
     WHERE id=$4 
     RETURNING id,name,email,phone,role`, [name, email, phone, id]);
    return result.rows[0];
};
const checkActiveBookings = async (userId) => {
    return await db_1.pool.query(`
    SELECT * FROM bookings 
    WHERE customer_id = $1 AND status = 'active'
    `, [userId]);
};
exports.userServices = {
    getAllUser,
    getSingleUser,
    getUserById,
    deleteUser,
    updateUser,
    checkActiveBookings
};
