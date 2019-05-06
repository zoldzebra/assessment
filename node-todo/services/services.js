const fs = require('fs');
const dbFilePath = require('../env');
const errors = {
    invalidText: "Only English letters allowed in text property, it is required.",
    invalidPriority: "Only null or integers between 1-5 allowed in priority property",
    invalidDone: "Only null or boolean type allowed in done property",
    dbFindOneError: "Something went wrong while getting todo by id. Probably the id is invalid."
}

loadDbFile = () => {
    console.log('loading db...');
    let db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    return db;
};

saveToDbFile = (db) => {
    console.log('saving db...');
    fs.writeFileSync(dbFilePath, JSON.stringify(db));
};

findOneById = (id) => {
    const db = loadDbFile();
    let findOneByIdError = {};
    const findOneTodo = db.filter(todo => todo.id === id);
    return findOneTodo.length != 1
        ? findOneByIdError = {findOneByIdError: errors.dbFindOneError}
        : findOneTodo[0];
}

validateTodo = (newTodo) => {
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

checkDefaults = (newTodo) => {
    newTodo.priority === null ? newTodo.priority = 3 : null;
    newTodo.done === null ? newTodo.done = false : null;
    return newTodo;
}

module.exports = {loadDbFile, saveToDbFile, findOneById, validateTodo, checkDefaults};