module.exports = function(app) {
    const controllers = require('../controllers/controllers');

    app.route('/')
        .get(function(req, res) {
            res.send('Server runs.');
        });

    app.route('/todos')
        .get(controllers.getTodos)
        .post(controllers.createTodo);

}