const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = require('chai').expect;
const should = chai.should();
const dbFilePath = require('../env');
const fs = require('fs');

chai.use(chaiHttp);

describe('GET /', () => {
    it('it should check if the server is up', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
            done();
            });       
    });
});

describe('GET /todos', () => {
    it('it should GET db array', (done) => {
        chai.request(server)
            .get('/todos')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });       
    });
});

describe('POST /todos', () => {
    it('it should POST a well formed todo properly', (done) => {
        const todo = {
            "text": "testTodoPOST",
            "priority": 1,
            "done": false
        }
        chai.request(server)
            .post('/todos')
            .send(todo)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.id.should.be.a('number');
                res.body.should.have.property('text').eql(todo.text);
                res.body.text.should.be.a('string');
                res.body.should.have.property('priority').eql(todo.priority);
                res.body.priority.should.be.a('number');
                res.body.should.have.property('done').eql(todo.done);
                res.body.done.should.be.a('boolean');
                done();
            });
    });
    it('it should write to db', (done) => {
        let db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const dbStartingLenth = db.length;
        const todo = {
            "text": "testTodoPOST",
            "priority": 1,
            "done": false
        }
        chai.request(server)
            .post('/todos')
            .send(todo)
            .then(() => {
                db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
                expect(db.length).to.equal(dbStartingLenth + 1);
                done();
            })
    });
    it('it should use defaults if "priority" or "done" is null', (done) => {
        const todo = {
            "text": "testTodoPOST",
            "priority": null,
            "done": null
        }
        chai.request(server)
            .post('/todos')
            .send(todo)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('priority').eql(3);
                res.body.should.have.property('done').eql(false);
                done();
            });
    });
    it('it should respond with 400 and validity errors if todo is invalid', (done) => {
        const todo = {
            "text": 12323,
            "priority": 1,
            "done": false
        }
        chai.request(server)
            .post('/todos')
            .send(todo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('textError');
                done();
            });
    });
});

describe('GET /todos/:id', () => {
    it('it should GET todo by "id"', (done) => {
        const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const id = db[0].id;
        chai.request(server)
            .get('/todos/' + id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res.body.id).to.equal(id);
                done();
            });
    });
    it('it should GET findOneById error with invalid "id"', (done) => {
        chai.request(server)
            .get('/todos/00001' )
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('findOneByIdError');
                done();
            });
    });
});