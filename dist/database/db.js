"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = exports.pool = void 0;
const pg_1 = require("pg");
const config_1 = __importDefault(require("../config"));
//import config from "../config";
exports.pool = new pg_1.Pool({
    connectionString: config_1.default.connection_str
});
const initDB = async () => {
    await exports.pool.query(`
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
    await exports.pool.query(`
        CREATE TABLE IF NOT EXISTS Vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name TEXT NOT NULL,
        type VARCHAR(100) NOT NULL
            CHECK(type IN ('car', 'bike', 'van', 'SUV')),
        registration_number TEXT UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL
          CHECK( daily_rent_price >0),
        availability_status VARCHAR(100) NOT NULL
          CHECK( availability_status IN ( 'available','booked'))
        )
     `);
    await exports.pool.query(`
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
    console.log("db connected");
};
exports.initDB = initDB;
