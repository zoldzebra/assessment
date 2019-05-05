const dbFiles = {
    'test': './db/test_db.json',
    'dev': './db/db.json'
};

const dbFilePath = dbFiles[process.env.NODE_ENV];

module.exports = dbFilePath;