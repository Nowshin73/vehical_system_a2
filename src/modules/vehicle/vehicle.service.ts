import bcrypt from "bcryptjs";
import { pool } from "../../database/db";

const createVehicle = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    //const hashPassword = await bcrypt.hash(password as string, 12);

    const result = await pool.query(
        `
      INSERT INTO Vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status ) VALUES($1,$2,$3,$4,$5) RETURNING id,vehicle_name, type, registration_number, daily_rent_price, availability_status
    `,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return result;
};

const getAllVehicles = async () => {
    const result = await pool.query(
        `
    SELECT * FROM Vehicles
    `
    );

    return result;
};

const getVehicleDetail = async (id: string) => {
    const result = await pool.query(`SELECT * FROM Vehicles WHERE id = $1`, [id]);
    return result;
}

const deleteVehicle = async (id: string) => {
    const result = await pool.query(`DELETE FROM Vehicles WHERE id = $1`, [id]);
    return result;
}


const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await pool.query(
        `UPDATE Vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 
      RETURNING id,vehicle_name, type, registration_number, daily_rent_price, availability_status`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id])
    return result;
}
export const vehicleServices = {
    createVehicle,
    getAllVehicles,
    getVehicleDetail,
    updateVehicle,
    deleteVehicle
};