const UserModel = require('../models/user');
const SeedModel = require('../models/seed');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');

const seedActions = {
    allProvinces: asyncMiddleware(async (req, res) => {
        let provinces = await SeedModel.province.find();
        if (provinces) {
            res.status(status.success.accepted).json({
                message: 'List Of Provinces',
                data: provinces
            });
        }
    }),
    cities: asyncMiddleware(async (req, res) => {
        let cities = await SeedModel.city.find({parentId: req.params.id});
        if (cities) {
            res.status(status.success.accepted).json({
                message: 'List Of Cities',
                data: cities
            });
        }
    })
};

module.exports = seedActions;