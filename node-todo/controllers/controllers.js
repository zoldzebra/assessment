const services = require('../services/services');

getTodos = function(req, res) {
    res.send(services.getCacheDb());
};

getTodoById = function(req, res) {
    const result = services.getTodoById(parseInt(req.params.id));
    services.isError(result) ? res.status(404).send(result) : res.send(result);
};

createTodo = function(req, res) {
    let newTodo = req.body;  

    const result = services.correctTodoFormat(newTodo);
    if (services.isError(result)) {
        res.status(400).send(result)
    } else {
        services.saveNewTodo(result);
        res.send(result);
    }
};

updateById = function(req, res) {
    const id = parseInt(req.params.id);
    const result = services.updateTodoById(id, req.body);
    services.isError(result) ? res.status(400).send(result) : res.send(result);
}

deleteById = function(req, res) {
    const id = parseInt(req.params.id);
    const result = services.deleteTodoById(id);
    services.isError(result) ? res.status(404).send(result) : res.sendStatus(200);
}

module.exports = {getTodos, getTodoById, createTodo, updateById, deleteById};