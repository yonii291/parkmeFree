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

describe("POST /register", function () {

    //Create a user with correct informations
    it('should create a user with correct informations', async function () {
        const res = await supertest(app)
            .post('/register')
            .send({
                firstname: 'John',
                lastname: 'Doe',
                username: 'johndoe',
                password: '1234',
                email: "johndoe@gmail.com",
                admin: false,
            })
            .expect(201)
            .expect('Content-Type', /json/);
        // Check that the response body is a JSON object with exactly the properties we expect.
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.firstname).toEqual('John');
        expect(res.body.lastname).toEqual('Doe');
        expect(res.body.username).toEqual('johndoe');
        expect(res.body.email).toEqual('johndoe@gmail.com');
        expect(res.body.admin).toEqual(false);
        expect(res.body).toContainAllKeys(['_id', 'admin', 'firstName', 'lastName', 'userName', 'email', 'creationDate'])

    });

    //Create a users with empty fields
    it('should not create a user with blanck informations', async function () {
        const res = await supertest(app)
            .post('/users/allUsers')
            .send({
                firstName: '',
                lastName: '',
                userName: '',
                password: '',
                email: ''
            })
            .expect(500)
        expect(res.text).toEqual("User validation failed: firstName: You must provide a name!, lastName: You must provide a lastname!, userName: You must provide a username!, email: You must provide a email")
    });

    //Create a user with a username that already exists
    it('should not create a user when the username is already existing', async function () {
        let jackReach
        jackReach = User.create({ admin: false, firstName: 'Jack', lastName: 'Reach', userName: "jackreach", password: '1234', creationDate: '2022-11-17T18:31:44.268+00:00' })
        const res = await supertest(app)
            .post('/users/allUsers')
            .send({
                firstName: 'Pierre',
                lastName: 'Jame',
                userName: 'jackreach',
                password: '1234',
                email: 'pierrejame@gmail.com'
            })
            .expect(500)
        expect(res.text).toEqual("User validation failed: userName: userName is already taken")
    });

});


describe('GET /users/allUsers', function () {
    //Create 3 users to begin the tests
    let jackReach
    let pierreJame
    let davidNor
    beforeEach(async function () {
        [jackReach, pierreJame, davidNor] = await Promise.all([
            User.create({ admin: false, firstName: 'Jack', lastName: 'Reach', userName: "jackreach", password: '1234', creationDate: '2022-11-17T18:31:44.268+00:00' }),
            User.create({ admin: true, firstName: 'Pierre', lastName: 'Jame', userName: "pierrejame", password: '1234', creationDate: '2022-11-18T18:31:44.268+00:00' }),
            User.create({ admin: false, firstName: 'David', lastName: 'Nor', userName: "davidnor", password: '1234', creationDate: '2022-11-19T18:31:44.268+00:00' }),
        ]);
    })

    //Get the list of all users
    test('should retrieve the list of users, in correct creationDate order, with aggregation of nb of parks posted', async function () {
        const res = await supertest(app)
            .get('/users/allUsers')
            .expect(200)
            .expect('Content-Type', /json/);
        //Assertions
        expect(res.body).toBeArray();
        expect(res.body).toHaveLength(3);

        expect(res.body[2]).toBeObject();
        expect(res.body[2]._id).toBeString();
        expect(res.body[2].admin).toEqual(false);
        expect(res.body[2].firstName).toEqual('Jack');
        expect(res.body[2].lastName).toEqual('Reach');
        expect(res.body[2].userName).toEqual('jackreach');
        expect(res.body[2].email).toEqual('jackreach@example.com');
        expect(res.body[2]).toContainAllKeys(['_id', 'admin', 'firstName', 'lastName', 'userName', 'email', 'creationDate', 'parksPosted'])

        expect(res.body[1]).toBeObject();
        expect(res.body[1]._id).toBeString();
        expect(res.body[1].admin).toEqual(true);
        expect(res.body[1].firstName).toEqual('Pierre');
        expect(res.body[1].lastName).toEqual('Jame');
        expect(res.body[1].userName).toEqual('pierrejame');
        expect(res.body[1].email).toEqual('pierrejame@example.com');
        expect(res.body[1]).toContainAllKeys(['_id', 'admin', 'firstName', 'lastName', 'userName', 'email', 'creationDate', 'parksPosted'])

        expect(res.body[0]).toBeObject();
        expect(res.body[0]._id).toBeString();
        expect(res.body[0].admin).toEqual(false);
        expect(res.body[0].firstName).toEqual('David');
        expect(res.body[0].lastName).toEqual('Nor');
        expect(res.body[0].userName).toEqual('davidnor');
        expect(res.body[0].email).toEqual('davidnor@example.com');
        expect(res.body[0]).toContainAllKeys(['_id', 'admin', 'firstName', 'lastName', 'userName', 'email', 'creationDate', 'parksPosted'])
    });


    //Get specific user by id
    test('should retrieve a specific user by id', async function () {
        const res = await supertest(app)
            .get(`/users/allUsers/${jackReach._id}`)
            .expect(200)
            .expect('Content-Type', /json/);
        //Assertions
        expect(res.body).toBeObject();
        expect(res.body._id).toBeString();
        expect(res.body.admin).toEqual(false);
        expect(res.body.firstName).toEqual('Jack');
        expect(res.body.lastName).toEqual('Reach');
        expect(res.body.userName).toEqual('jackreach');
        expect(res.body).toContainAllKeys(['_id', 'admin', 'firstName', 'lastName', 'userName', 'creationDate'])
    });

    //Get specific user by id, but not existing
    test('should not retrieve the specific user', async function () {
        const res = await supertest(app)
            .get(`/users/allUsers/78b54c3aef12a34233454fxy`)
            .expect(500)
            .expect('Content-Type', "text/html; charset=utf-8");
    });


    //Get a list of parks that a specific user has posted
    test('should not retrieve the specific user', async function () {
        //Create a car and a park to parkingSessions
        let car, park;

        // Créer une voiture et un parc en parallèle
        [car, park] = await Promise.all([
            Car.create({
                brand: 'Toyota',
                model: 'Corolla',
                licensePlate: 'VD654321',
            }),
            Park.create({
                name: 'City Park',
                location: 'Downtown',
                capacity: 100,
            }),
        ]);

        //Create some tricks belonging to jackReach before the get request
        let boardSlide
        let noseSlide
        [boardSlide, noseSlide] = await Promise.all([
            Trick.create({ name: 'board slide', video: 'video.mp4', spotId: ledge._id, userId: jackReach._id, creationDate: '2022-11-18T18:31:44.268+00:00' }),
            Trick.create({ name: 'nose slide', video: 'video.mp4', spotId: ledge._id, userId: jackReach._id, creationDate: '2022-11-19T18:31:44.268+00:00' })
        ])
        const res = await supertest(app)
            .get(`/users/${jackReach._id}/tricks`)
            .expect(200)
            .expect('Content-Type', /json/);
        //Assertions
        expect(res.body.data).toBeArray();
        expect(res.body.data).toHaveLength(2);

        expect(res.body.data[1]).toBeObject();
        expect(res.body.data[1]._id).toBeString();
        expect(res.body.data[1].spotId).toEqual(`${ledge._id}`);
        expect(res.body.data[1].userId).toEqual(`${jackReach._id}`);
        expect(res.body.data[1].name).toEqual('board slide');
        expect(res.body.data[1].video).toEqual('video.mp4');
        expect(res.body.data[1]).toContainAllKeys(['_id', 'name', 'video', 'spotId', 'userId', 'creationDate'])

        expect(res.body.data[0]).toBeObject();
        expect(res.body.data[0]._id).toBeString();
        expect(res.body.data[0].spotId).toEqual(`${ledge._id}`);
        expect(res.body.data[0].userId).toEqual(`${jackReach._id}`);
        expect(res.body.data[0].name).toEqual('nose slide');
        expect(res.body.data[0].video).toEqual('video.mp4');
        expect(res.body.data[0]).toContainAllKeys(['_id', 'name', 'video', 'spotId', 'userId', 'creationDate'])
        console.log(res.body)
    });
});

