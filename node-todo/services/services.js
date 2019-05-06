const fs = require('fs');

const dbFilePath = require('../env');
const errors = {
    invalidText: "Only English letters allowed in text property, it is required.",
    invalidPriority: "Only null or integers between 1-5 allowed in priority property",
    invalidDone: "Only null or boolean type allowed in done property",
    dbFindOneError: "Something went wrong while getting todo by id. Probably the id is invalid."
}

exports.loadDbFile = () => {
    console.log('loading db...');
    let db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    console.log('db:', db);
    return db;
};

exports.saveToDbFile = (db) => {
    console.log('saving db...');
    fs.writeFileSync(dbFilePath, JSON.stringify(db));
};

exports.findOneById = (id, db) => {
    let findOneByIdError = {};
    const findOneTodo = db.filter(todo => todo.id === id);
    return findOneTodo.length != 1
        ? findOneByIdError = {findOneByIdError: errors.dbFindOneError}
        : findOneTodo[0];
}

exports.validateTodo = (newTodo) => {
    const validityErrors = {};
    const onlyEnglishLetters = /^[a-z]+$/i;
    if (!onlyEnglishLetters.test(newTodo.text)) {
        validityErrors.invalidText = errors.invalidText
    }
    if (!((Number.isInteger(newTodo.priority))
        && (newTodo.priority > 0 && newTodo.priority < 6)
        || newTodo.priority === null)) {
        validityErrors.invalidPriority = errors.invalidPriority;
    }
    if (!(typeof newTodo.done === 'boolean' || newTodo.done === null)) {
        validityErrors.invalidDone = errors.invalidDone;
    }
    console.log('validityErrors =', validityErrors);
    return validityErrors;
}

exports.checkDefaults = (newTodo) => {
    newTodo.priority === null ? newTodo.priority = 3 : null;
    newTodo.done === null ? newTodo.done = false : null;
    return newTodo;
}