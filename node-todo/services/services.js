const fs = require('fs');
const actualEnvironment = require('../env');
const errors = {
    invalidProperty: "Invalid property!",
    invalidText: "Only English letters allowed in text property, it is required.",
    invalidPriority: "Only null or integers between 1-5 allowed in priority property",
    invalidDone: "Only null or boolean type allowed in done property",
    dbFindOneError: "Something went wrong while getting todo by id. Probably the id is invalid.",
}
let cacheDb = [];
const deleteList = [];
const deleteTime = actualEnvironment.timer;
const dbFilePath = actualEnvironment.db;

getTodoById = (id) => {
    const index = findTodoIndexById(id);
    return index != -1 
        ? cacheDb[index]
        : {findOneByIdError : errors.dbFindOneError}
};

loadDbToCache = () => {
    cacheDb = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    return cacheDb;
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
            timedDeleteManager(cacheDb[index]);
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

timedDeleteManager = (todo) => {
    if (todo.done && !isMarkedForDelete(todo.id)) {
        deleteList.push(todo.id);
        timedDelete(todo.id);
    } else if (isMarkedForDelete(todo.id)) {
        deleteList.splice(getDeleteListIndex(todo.id), 1);
    }
}

timedDelete = (id) => {
    const deleteListIndex = getDeleteListIndex(id);
    setTimeout(() => {
        if (isMarkedForDelete(id)) {
            deleteTodoById(id);
            deleteList.splice(deleteListIndex, 1);
        } else {
        }
    }, deleteTime);
}

correctTodoFormat = (todo) => {
    const validityErrors = validateTodo(todo);

    if (isError(validityErrors)) {
        return validityErrors;
    } else {
        return useDefaults(todo);
    }
}

validateTodo = (todo) => {
    const result = {};
    const validText = /^[a-z\s]+$/i;
    const validProperty = !(Object.keys(todo)
        .findIndex(property =>
            !(property === "text" || property === "priority" || property === "done"))
            != -1)
    const validPriority = ((Number.isInteger(todo.priority))
        && (todo.priority > 0 && todo.priority < 6)
        || todo.priority === null
        || todo.priority === undefined);
    const validDone = (typeof todo.done === 'boolean'
        || todo.done === null
        || todo.done === undefined);

    !validProperty
        ? result.propertyError = errors.invalidProperty : null;
    !validText.test(todo.text)
        ? result.textError = errors.invalidText : null;
    !validPriority
        ? result.priorityError = errors.invalidPriority : null;
    !validDone
        ? result.doneError = errors.invalidDone : null;

    return result;
}

useDefaults = (todo) => {
    (todo.priority === null || todo.priority === undefined) ? todo.priority = 3 : null;
    (todo.done === null || todo.done === undefined) ? todo.done = false : null;
    return todo;
}

isError = (result) => {
    return !(result.hasOwnProperty("text") || !Object.keys(result).length);
}

isMarkedForDelete = (id) => {
    return getDeleteListIndex(id) != -1;
}

getDeleteListIndex = (id) => {
    return deleteList.findIndex(deathRowId => deathRowId === id);
}

module.exports = {cacheDb, saveNewTodo, getTodoById, updateTodoById, deleteTodoById, correctTodoFormat, isError, validateTodo, useDefaults, loadDbToCache};