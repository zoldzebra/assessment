const express = require('express');
const services = require('../services/services');


exports.getTodos = function(req, res) {
    const db = services.loadDbFile();
    res.send(db);
};

exports.createTodo = function(req, res) {
    console.log('creating todo...');
    const newTodo = req.body;
    newTodo.id = Date.now();
    let db = services.loadDbFile();  
    db.push(newTodo);  
    services.saveToDbFile(db);
    res.send(newTodo);
};  