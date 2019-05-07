const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = require('chai').expect;
const should = chai.should();
const actualEnvironment = require('../env');
const fs = require('fs');

const dbFilePath = actualEnvironment.db;
const deleteByDonesTime = actualEnvironment.timer;
const timeGap = 1000;

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
        const dbStartingLength = db.length;
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
                expect(db.length).to.equal(dbStartingLength + 1);
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
                res.body.should.have.property('id').eql(id);
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

describe('PUT /todos/:id', () => {
    it('it should update todo with PUT', (done) => {
        const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const dbStartingLength = db.length;
        const oldTodo = db[0]
        const newTodo = {
            "text": "putThis",
            "priority": 1,
            "done": false
        };
        chai.request(server)
            .put('/todos/' + oldTodo.id)
            .send(newTodo)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id').eql(oldTodo.id);
                res.body.should.have.property('text').eql(newTodo.text);
                res.body.should.have.property('priority').eql(newTodo.priority);
                res.body.should.have.property('done').eql(newTodo.done);
                done();
            });
    });
    it('it should throw error message on invalid todo form', (done) => {
        const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const oldTodo = db[1]
        const updatedTodo = {
            "text": 123,
            "invalidproperty": "michael bay"
        };
        chai.request(server)
            .put('/todos/' + oldTodo.id)
            .send(updatedTodo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('textError');
                res.body.should.have.property('propertyError');
                done();
            });
    });
    it('it should throw error message if "id" is tried to sent in', (done) => {
        const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const oldTodo = db[1]
        const updatedTodo = {
            "id": 123,
        };
        chai.request(server)
            .put('/todos/' + oldTodo.id)
            .send(updatedTodo)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('propertyError');
                done();
            });
    });
    it('it should not change todo if empty object is sent', (done) => {
        const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const oldTodo = db[1]
        const updatedTodo = {};
        chai.request(server)
            .put('/todos/' + oldTodo.id)
            .send(updatedTodo)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id').eql(oldTodo.id);
                res.body.should.have.property('text').eql(oldTodo.text);
                res.body.should.have.property('priority').eql(oldTodo.priority);
                res.body.should.have.property('done').eql(oldTodo.done);
                done();
            });
    });
    it('it should mutate todo in db if valid todo sent', (done) => {
        let db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const dbStartingLength = db.length;
        const oldTodo = db[1];
        const newTodo = {
            "text": "putThis",
            "priority": 1,
            "done": false
        }
        chai.request(server)
            .put('/todos/'+ oldTodo.id)
            .send(newTodo)
            .then(() => {
                db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
                expect(db.length).to.equal(dbStartingLength);
                expect(db[1].id).to.equal(oldTodo.id);
                expect(db[1].text).to.equal(newTodo.text);
                expect(db[1].priority).to.equal(newTodo.priority);
                expect(db[1].done).to.equal(newTodo.done);
                done();
            })
    });
    it('it should NOT mutate todo in db if empty todo sent', (done) => {
        let db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const dbStartingLength = db.length;
        const oldTodo = db[1];
        const emptyTodo = {};
        chai.request(server)
            .put('/todos/'+ oldTodo.id)
            .send(emptyTodo)
            .then(() => {
                db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
                expect(db.length).to.equal(dbStartingLength);
                expect(db[1].id).to.equal(oldTodo.id);
                expect(db[1].text).to.equal(oldTodo.text);
                expect(db[1].priority).to.equal(oldTodo.priority);
                expect(db[1].done).to.equal(oldTodo.done);
                done();
            })
    });
});
describe('DELETE /todos/:id', () => {
    it('it should delete todo', (done) => {
        let db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const dbStartingLength = db.length;
        const deleteTodo = db[0]
        chai.request(server)
            .delete('/todos/'+ deleteTodo.id)
            .then(() => {
                db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
                expect(db.length).to.equal(dbStartingLength - 1);
                expect(db.find(todo => todo.id === deleteTodo.id)).to.be.undefined;
                done();
            });
    });
    it('it should not delete todo with invalid id', (done) => {
        let db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const dbStartingLength = db.length;
        const deleteTodo = db[0]
        chai.request(server)
            .delete('/todos/'+ 999)
            .then((err, res) => {
                db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
                expect(db.length).to.equal(dbStartingLength);
                expect(db[0].id).to.equal(deleteTodo.id);
                done();
            });
    });
});
describe('PUT + DELETE /todos/:id', () => {
    it('it should delete todo with done = true after ' + deleteByDonesTime + 'ms in testing\nChecking it after ' + (deleteByDonesTime + timeGap) + 'ms.', (done) => {
        let db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
        const dbStartingLength = db.length;
        const oldTodo = db[0];
        const updateTodo = {
            "done": true
        }
        chai.request(server)
            .put('/todos/'+ oldTodo.id)
            .send(updateTodo)
            .then(() => {
                setTimeout(() => {
                    db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
                    expect(db.length).to.equal(dbStartingLength - 1);
                    expect(db.find(todo => todo.id === oldTodo.id)).to.be.undefined;
                    done();
                }, deleteByDonesTime + timeGap);
            });
    });
});