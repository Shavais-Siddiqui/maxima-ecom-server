const UserModel = require('../models/user');
const asyncMiddleware = require('../utils/asyncMiddleware');

const userActions = {
    add: asyncMiddleware( async (req, res, next) => {
        let user = new UserModel({
            name: 'Ayaz Hussain',
            email: 'ayazhussainbs@gmail.com'
        });
        user.save();
    })
};

module.exports = userActions;
