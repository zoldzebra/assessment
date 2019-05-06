const fs = require('fs');
const dbFilePath = require('../env');
const errors = {
    invalidText: "Only English letters allowed in text property, it is required.",
    invalidPriority: "Only null or integers between 1-5 allowed in priority property",
    invalidDone: "Only null or boolean type allowed in done property",
    dbFindOneError: "Something went wrong while getting todo by id. Probably the id is invalid.",
}
let cacheDb = [];

getCacheDb = () => {
    return cacheDb;
}

getTodoById= (id) => {
    const index = findTodoIndexById(id);
    return index != -1 
        ? cacheDb[index]
        : {findOneByIdError : errors.dbFindOneError}
    }

loadDbToCache = () => {
    // console.log('loading db to CACHE...');
    cacheDb = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    // console.log('db in CACHE:', cacheDb);
};

saveNewTodo = (newTodo) => {
    saveToCacheDb(newTodo);
    saveCacheDbToFile();
}

saveToCacheDb = (todo) => {
    cacheDb.push(todo);
}

saveCacheDbToFile = (todo) => {
    // console.log('db in CACHE:', cacheDb);
    // console.log('saving db from CACHE...');
    fs.writeFileSync(dbFilePath, JSON.stringify(cacheDb));
};


findTodoIndexById = (id) => {
    return cacheDb.findIndex(todo => todo.id === id);
}

updateTodoById = (id, newTodo) => {
    let updateByIdError = {};
    const oldTodo = findOneById(id);
    console.log('old todo:', oldTodo);
    if (oldTodo.hasOwnProperty("findOneByIdError")) {
        return oldTodo;
    } else {
        const updatedTodo = Object.assign(oldTodo, newTodo);
        console.log('updating old todo to...', updatedTodo);
        Object.assign(oldTodo, newTodo);
        return updatedTodo;
    }    
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

module.exports = {cacheDb, saveNewTodo, getTodoById, validateTodo, checkDefaults, loadDbToCache, getCacheDb};