const SeedModel = require('./models/seed');
const mongoose = require('mongoose');
const jsonConfig = require('./config/config.json');
const data = require('./utils/data.json');

let config = jsonConfig['development'];
mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function () {
    console.log('Database is connected!');
    // First Store All The Provinces In Db

    let province = await SeedModel.province.collection.insert(data['provinces']);
    if (province) {
        for (let i = 0; i < province.ops.length; i++) {
            let cityWithParentId = data['city'][i].cities.map(x => {
                return {
                    name: x.name,
                    parentId: province.ops[i]._id
                }
            });
            // Add Cities In Particular Provinces

            await SeedModel.city.collection.insert(cityWithParentId);
        }
        mongoose.disconnect();
    }
});