var fs = require('fs');

const dbFilePath = require('../env');

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