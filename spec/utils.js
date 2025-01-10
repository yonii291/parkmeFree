import { User } from '../model/User.js';
import {Car} from '../model/Car.js';
import { Park } from '../model/Park.js';
import { ParkingSession } from '../model/ParkingSession.js';
import jwt from "jsonwebtoken";
import config from "../config/config.js"

const secretKey = config.jwtSecret

export const cleanUpDatabase = async function () {
    await Promise.all([
        User.deleteMany(),
        Car.deleteMany(),
        Park.deleteMany(),
        ParkingSession.deleteMany()
    ]);
};

// Function to generate a valid JWT for a given user.
export function generateValidJwt(user) {
    // Generate a valid JWT which expires in 7 days.
    const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
    const claims = { sub: user._id.toString(), exp: exp };
    return new Promise((resolve, reject) => {
        jwt.sign(claims, secretKey, function (err, token) {
            if (err) {
                return reject(err);
            }
            resolve(token);
        });
    });
}