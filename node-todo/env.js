const environments = {
    'test': {
        'db': './db/test_db.json',
        'timer': 2000
    },
    'dev': {
        'db': './db/db.json',
        'timer': 2000
    }
};

const actualEnvironment = environments[process.env.NODE_ENV];

module.exports = actualEnvironment;