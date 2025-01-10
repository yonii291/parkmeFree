import supertest from "supertest"
import app from "../app.js"
import mongoose from 'mongoose'
import { cleanUpDatabase, generateValidJwt } from './utils.js';
import { User } from '../model/User.js';
import { Car } from '../model/Car.js';
import { Park } from '../model/Park.js';
import { ParkingSession } from '../model/ParkingSession.js';




//Clean database before
beforeEach(cleanUpDatabase)

/*
describe("POST /api/cars/create", function () {

// Create a car with correct informatio
it('should create a car with correct information', async function () {
    const res = await supertest(app)
        .post('/api/cars/create')
        .send({
            model: 'Seat Ibiza',
            height: 150,
            license_plate: 'VD123456'
        })
        .expect(201)
        .expect('Content-Type', /json/);
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.model).toEqual('Seat Ibiza');
        expect(res.body.height).toEqual(150);
        expect(res.body.license_plate).toEqual('VD123456');
        expect(res.body).toContainAllKeys(['_id', 'model', 'height', 'license_plate', 'creationDate']);
});

 // Create a car with missing required fields
 it('should not create a car with missing required fields', async function () {
    const res = await supertest(app)
        .post('/api/cars/create')
        .send({
            model: '',
            height: null,
            license_plate: ''
        })
        .expect(500); 
    // Check the error message
    expect(res.body).toBeObject();
    expect(res.body.error).toBeString();
    expect(res.body.error).toContain("Validation failed");
});

});
*/



describe('GET /api/cars', function () {
    // Create a few cars
    let VD123456
    let AB123456
    let CD123456

    beforeEach(async function () {
        [VD123456, AB123456, CD123456] = await Car.create([
            { model: 'Seat Ibiza', height: 150, license_plate: 'VD123456' },
            { model: 'Fiat Punto', height: 160, license_plate: 'AB123456' },
            { model: 'Audi A6', height: 170, license_plate: 'CD123456' },
        ]);
    });


    // Get specific car by id
    test('should retrieve a specific car by id', async function () {
        const token = await generateValidJwt(VD123456)
        const res = await supertest(app)
            .get(`/api/cars/${VD123456._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);
        // Assertions
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.model).toEqual('Seat Ibiza');
        expect(res.body.height).toEqual(150);
        expect(res.body.license_plate).toEqual('VD123456');
        expect(res.body).toContainAllKeys(['_id', 'model', 'height', 'license_plate', 'creationDate']);
    });

    //Get specific user by id, but not existing
    test('should not retrieve the specific car', async function () {
        const res = await supertest(app)
            .get(`/api/cars/78b54c3aef12a34233454fxy`)
            .expect(500)
            .expect('Content-Type', "text/html; charset=utf-8");
    });

    // Get all cars
    test('should retrieve all cars', async function () {
        const res = await supertest(app)
            .get('/api/cars')
            .expect(200)
            .expect('Content-Type', /json/);

        // Assertions
        expect(res.body).toBeArrayOfSize(3);
        expect(res.body[0]).toContainAllKeys(['_id', 'model', 'height', 'license_plate', 'creationDate']);
    });


    // Ensure no duplicate cars in the response
    test('should not return duplicate cars', async function () {
        const res = await supertest(app)
            .get('/api/cars')
            .expect(200)
            .expect('Content-Type', /json/);

        // Assertions
        const carIds = res.body.map(car => car._id);
        expect(new Set(carIds).size).toEqual(carIds.length); // Ensure all IDs are unique
    });

});


//Disconnect database afterwards
afterAll(async () => {
    await mongoose.disconnect();
});

