const fs = require('fs');
const dbFilePath = require('../env');
const errors = {
    invalidProperty: "Invalid property!",
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
    newTodo.id = Date.now();
    saveToCacheDb(newTodo);
    saveCacheDbToFile();
}

saveToCacheDb = (todo) => {
    cacheDb.push(todo);
}

saveCacheDbToFile = () => {
    fs.writeFileSync(dbFilePath, JSON.stringify(cacheDb));
};


findTodoIndexById = (id) => {
    return cacheDb.findIndex(todo => todo.id === id);
}

updateTodoById = (id, todo) => {
    const index = findTodoIndexById(id);
    if (index === -1) {
        return {findOneByIdError : errors.dbFindOneError};
    } else {
        const result = validateTodo(todo);
        if (isError(result)) {
            return result;
        } else {
            const oldTodo = cacheDb[index];
            cacheDb[index] = Object.assign(oldTodo, todo);
            saveCacheDbToFile();
            return cacheDb[index];
        }
    }    
}

deleteTodoById = (id) => {
    const index = findTodoIndexById(id);
    if (index === -1) {
        return {findOneByIdError : errors.dbFindOneError};
    } else {
        cacheDb.splice(index, 1);
        saveCacheDbToFile();
        return {};
    }
}

correctTodoFormat = (todo) => {
    const validityErrors = validateTodo(todo);

    if (isError(validityErrors)) {
        return validityErrors;
    } else {
        return useDefaults(todo);
    }
}

isError = (result) => {
    return !(result.hasOwnProperty("text") || !Object.keys(result).length) ? true : false;
}

validateTodo = (todo) => {
    const result = {};
    const onlyEnglishLetters = /^[a-z]+$/i;
    const invalidProperty = Object.keys(todo).
        findIndex(property => !(property === "text" || property === "priority" || property === "done"));

    console.log('invalidProperty:', invalidProperty, Object.keys(todo));

    if (invalidProperty != -1) {
        result.propertyError = errors.invalidProperty
    }

    if (!onlyEnglishLetters.test(todo.text)) {
        result.textError = errors.invalidText
    }
    if (!((Number.isInteger(todo.priority))
        && (todo.priority > 0 && todo.priority < 6)
        || todo.priority === null
        || todo.priority === undefined)) {
            result.priorityError = errors.invalidPriority;
    }
    if (!(typeof todo.done === 'boolean'
        || todo.done === null
        || todo.done === undefined)) {
            result.doneError = errors.invalidDone;
    }
    return result;
}

useDefaults = (todo) => {
    (todo.priority === null || todo.priority === undefined) ? todo.priority = 3 : null;
    (todo.done === null || todo.done === undefined) ? todo.done = false : null;
    return todo;
}

module.exports = {cacheDb, getCacheDb, saveNewTodo, getTodoById, updateTodoById, deleteTodoById, correctTodoFormat, isError, validateTodo, useDefaults, loadDbToCache};