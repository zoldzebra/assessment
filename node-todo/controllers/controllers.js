const services = require('../services/services');

getTodos = function(req, res) {
    res.send(services.getCacheDb());
};

getTodoById = function(req, res) {
    const result = services.getTodoById(parseInt(req.params.id));
    result.hasOwnProperty("findOneByIdError") ? res.status(404).send(result) : res.send(result);
};

updateById = function(req, res) {
    const id = parseInt(req.params.id);
    const result = services.updateTodoById(id, req.body);
    // res.send(result);
}

createTodo = function(req, res) {
    console.log('creating todo...');
    let newTodo = req.body;
    newTodo.id = Date.now();
    const validityErrors = services.validateTodo(newTodo);

    if (Object.entries(validityErrors).length != 0) {
        res.status(400).send(validityErrors);
    } else {
        // let db = services.loadDbFile();
        newTodo = services.checkDefaults(newTodo);
        // db.push(newTodo);
        services.saveNewTodo(newTodo);
        res.send(newTodo);
    }
};

module.exports = {getTodos, getTodoById, createTodo, updateById};