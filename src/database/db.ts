import { Pool } from "pg";
//import config from "../config";

export const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_JoGx3hD0RCim@ep-lively-frost-a4pymnhd-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

export const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS Users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL
         CHECK(email = LOWER(email)),
        password TEXT NOT NULL
         CHECK(LENGTH(TRIM(password))>=6),
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(100) NOT NULL
            CHECK (role IN ('admin', 'customer'))
        )
     `);
  await pool.query(`
        CREATE TABLE IF NOT EXISTS Vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(250) NOT NULL,
        type VARCHAR(100) NOT NULL
            CHECK(type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL
          CHECK( daily_rent_price >0),
        availability_status VARCHAR(100) NOT NULL
          CHECK( availability_status IN ( 'available','booked'))
        )
     `);
  await pool.query(`
        CREATE TABLE IF NOT EXISTS Bookings(
          id SERIAL PRIMARY KEY,
          customer_id INT NOT NULL
            REFERENCES Users(id) ON DELETE CASCADE,
          vehicle_id INT NOT NULL
            REFERENCES Vehicles(id) ON DELETE CASCADE,
          rent_start_date Date NOT NULL,
          rent_end_date Date NOT NULL
            CHECK( rent_end_date > rent_start_date ),
          total_price INT NOT NULL
           CHECK( total_price > 0),
          status VARCHAR(100) NOT NULL 
           CHECK( status IN ('active', 'cancelled', 'returned'))
        )
     `);

        console.log("db connected")
};
