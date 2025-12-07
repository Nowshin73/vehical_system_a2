import bcrypt from "bcryptjs";
import { pool } from "../../database/db";

const createVehicle = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

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
export const updateVehicleInDB = async (
  id: number,
  payload: any,
  role: string
) => {
  if (role === "customer") {
    delete payload.daily_rent_price;
    delete payload.registration_number;
    delete payload.type;
  }

  const fields = Object.keys(payload);
  const values = Object.values(payload);

  if (fields.length === 0) throw new Error("No fields to update");

  const set = fields.map((f, i) => `${f}=$${i + 1}`).join(",");

  const result = await pool.query(
    `UPDATE vehicles SET ${set} WHERE id=$${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  if (result.rows.length === 0) throw new Error("Vehicle not found");

  return result.rows[0];
};


// const updateVehicle = async (payload: Record<string, unknown>, id: string) => {
//     const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
//     const result = await pool.query(
//         `UPDATE Vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 
//       RETURNING id,vehicle_name, type, registration_number, daily_rent_price, availability_status`,
//         [vehicle_name, type, registration_number, daily_rent_price, availability_status, id])
//     return result;
// }

export const vehicleServices = {
    createVehicle,
    getAllVehicles,
    getVehicleDetail,
    updateVehicle,
    deleteVehicle
};