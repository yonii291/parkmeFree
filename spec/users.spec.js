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

describe("POST /api/users/register", function () {

    //Create a user with correct informations
    it('should create a user with correct informations', async function () {
        const res = await supertest(app)
            .post('/api/users/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                userName: 'johndoe',
                password: '1234',
                email: "johndoe@gmail.com",
                admin: false
            })
            .expect(201)
            .expect('Content-Type', /json/);
        // Check that the response body is a JSON object with exactly the properties we expect.
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.firstName).toEqual('John');
        expect(res.body.lastName).toEqual('Doe');
        expect(res.body.userName).toEqual('johndoe');
        expect(res.body.email).toEqual('johndoe@gmail.com');
        expect(res.body.admin).toEqual(false);
        expect(res.body).toContainAllKeys(['firstName', 'lastName', 'userName', 'password', 'email', 'admin', '_id', 'creationDate', '__v', 'token']);


    });

    //Create a users with empty fields
    it('should not create a user with blanck informations', async function () {
        const res = await supertest(app)
            .post('/api/users/register')
            .send({
                firstName: '',
                lastName: '',
                userName: '',
                password: '',
                email: ''
            })
            .expect(500)
        expect(res.text).toEqual("{\"message\":\"Error saving the user\"}")
    });

    //Create a user with a username that already exists
    it('should not create a user when the username is already existing', async function () {
        let jackReach
        jackReach = User.create({ admin: false, firstName: 'Jack', lastName: 'Reach', userName: "jackreach", email: 'pierrejame@gmail.com', password: '1234', creationDate: '2022-11-17T18:31:44.268+00:00' })
        const res = await supertest(app)
            .post('/api/users/register')
            .send({
                firstName: 'Pierre',
                lastName: 'Jame',
                userName: 'jackreach',
                password: '1234',
                email: 'pierrejame@gmail.com'
            })
            .expect(409)
        expect(res.text).toEqual("{\"message\":\"User already exists\"}")
    });

});


describe('GET /api/users', function () {
    //Create 3 users to begin the tests
    let jackReach
    let pierreJame
    let davidNor
    beforeEach(async function () {
        [jackReach, pierreJame, davidNor] = await Promise.all([
            User.create({ admin: false, firstName: 'Jack', lastName: 'Reach', userName: "jackreach", email: 'jackreach@gmail.com', password: '1234', creationDate: '2022-11-17T18:31:44.268+00:00' }),
            User.create({ admin: true, firstName: 'Pierre', lastName: 'Jame', userName: "pierrejame", email: 'pierrejame@gmail.com', password: '1234', creationDate: '2022-11-18T18:31:44.268+00:00' }),
            User.create({ admin: false, firstName: 'David', lastName: 'Nor', userName: "davidnor", email: 'davidnor@gmail.com', password: '1234', creationDate: '2022-11-19T18:31:44.268+00:00' }),
        ]);
    })

    //Get specific user by id
    test('should retrieve a specific user by id', async function () {
        const token = await generateValidJwt(jackReach)
        const res = await supertest(app)
            .get(`/api/users/${jackReach._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);
        //Assertions
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.admin).toEqual(false);
        expect(res.body.firstName).toEqual('Jack');
        expect(res.body.lastName).toEqual('Reach');
        expect(res.body.userName).toEqual('jackreach');
        expect(res.body.email).toEqual('jackreach@gmail.com');
        expect(res.body).toContainAllKeys(['_id', 'admin', 'firstName', 'lastName', 'userName', 'email', 'password', 'creationDate'])
    });

    //Get specific user by id, but not existing
    test('should not retrieve the specific user', async function () {
        const token = await generateValidJwt(davidNor)
        const res = await supertest(app)
            .get(`/api/users/78b54c3aef12a34233454fxy`)
            .set('Authorization', `Bearer ${token}`)
            .expect(500)
            .expect('Content-Type', "text/html; charset=utf-8");
    });


});

describe('PUT /api/users/update/', function () {
    let jackReach
    let pierreJame
    beforeEach(async function () {
        [jackReach, pierreJame] = await Promise.all([
            User.create({ admin: false, firstName: 'Jack', lastName: 'Reach', userName: "jackreach", email: 'jackreachy@gmail.com', password: '1234', creationDate: '2022-11-17T18:31:44.268+00:00' }),
            User.create({ admin: true, firstName: 'Pierre', lastName: 'Jame', userName: "pierrejame", email: 'pierrejame@gmail.com', password: '1234', creationDate: '2022-11-18T18:31:44.268+00:00' })
        ]);
    })



    //Modify own profile
    it('user could modify his own profile', async function () {
        const token = await generateValidJwt(jackReach)
        const res = await supertest(app)
            .put(`/api/users/update/${jackReach._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'Jacky',
                lastName: 'Reachy',
                userName: 'jackreachy',
                email: 'jackreachy@gmail.com',
                password: '5678'
            })
            .expect(200)
            .expect('Content-Type', /json/);
        //Assertions
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.firstName).toEqual('Jacky');
        expect(res.body.lastName).toEqual('Reachy');
        expect(res.body.userName).toEqual('jackreachy');
        expect(res.body.email).toEqual('jackreachy@gmail.com');
        expect(res.body.admin).toEqual(false);
        expect(res.body).toContainAllKeys(["_id", "firstName", "lastName", "userName", "password", "email", "creationDate", "admin"]);

    });
});


describe('DELETE /api/users/delete/', function () {
    //Create a user to begin the tests
    let davidNor
    beforeEach(async function () {
        [davidNor] = await Promise.all([
            User.create({ admin: false, firstName: 'David', lastName: 'Nor', userName: "davidnor", email: 'davidnor@gmail.com', password: '1234', creationDate: '2022-11-19T18:31:44.268+00:00' })
        ]);
    })

    it('user should delete his own profile', async function () {
        const token = await generateValidJwt(davidNor)
        const res = await supertest(app)
            .delete(`/api/users/delete/${davidNor._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);
        //Assertions
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.admin).toEqual(false);
        expect(res.body.firstName).toEqual('David');
        expect(res.body.lastName).toEqual('Nor');
        expect(res.body.userName).toEqual('davidnor');
        expect(res.body.email).toEqual('davidnor@gmail.com');
        expect(res.body).toContainAllKeys(["_id", "firstName", "lastName", "userName", "password", "email", "creationDate", "admin"])
    });
});


//Disconnect database afterwards
afterAll(async () => {
    await mongoose.disconnect();
});