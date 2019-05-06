const express = require('express');
const services = require('../services/services');


exports.getTodos = function(req, res) {
    const db = services.loadDbFile();
    res.send(db);
};

exports.getTodoById = function(req, res) {
    const id = parseInt(req.params.id);
    const db = services.loadDbFile();
    const result = services.findOneById(id, db);
    result.hasOwnProperty("findOneByIdError") ? res.status(404).send(result) : res.send(result);
};

exports.createTodo = function(req, res) {
    console.log('creating todo...');
    let newTodo = req.body;
    newTodo.id = Date.now();
    const validityErrors = services.validateTodo(newTodo);

    if (Object.entries(validityErrors).length != 0) {
        res.status(400).send(validityErrors);
    } else {
        let db = services.loadDbFile();
        newTodo = services.checkDefaults(newTodo);
        db.push(newTodo);
        services.saveToDbFile(db);
        res.send(newTodo);
    }
};  