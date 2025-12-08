"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleServices = void 0;
const db_1 = require("../../database/db");
const createVehicle = async (payload) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await db_1.pool.query(`
      INSERT INTO Vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status ) VALUES($1,$2,$3,$4,$5) RETURNING id,vehicle_name, type, registration_number, daily_rent_price, availability_status
    `, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
    return result;
};
const getAllVehicles = async () => {
    const result = await db_1.pool.query(`
    SELECT * FROM Vehicles
    `);
    return result;
};
const getVehicleDetail = async (id) => {
    const result = await db_1.pool.query(`SELECT * FROM Vehicles WHERE id = $1`, [id]);
    return result;
};
const deleteVehicle = async (id) => {
    const activeBookings = await db_1.pool.query(`
    SELECT * FROM bookings
    WHERE vehicle_id = $1 AND status = 'active'
    `, [id]);
    if (activeBookings.rows.length > 0) {
        return 2;
    }
    const result = await db_1.pool.query(`DELETE FROM Vehicles WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
        return 0;
    }
    return 1;
};
const updateVehicle = async (payload, id) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await db_1.pool.query(`UPDATE Vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 
      RETURNING id,vehicle_name, type, registration_number, daily_rent_price, availability_status`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]);
    return result;
};
exports.vehicleServices = {
    createVehicle,
    getAllVehicles,
    getVehicleDetail,
    updateVehicle,
    deleteVehicle
};
