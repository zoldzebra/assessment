let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

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
    it('it should POST a todo properly', (done) => {
        const todo = {
            text: "test todo",
            priority: 1,
            done: false
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
});