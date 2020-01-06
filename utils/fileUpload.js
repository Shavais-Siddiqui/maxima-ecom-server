const cloudinary = require('cloudinary').v2;
const jsonConfig = require('../config/config.json');
const datauri = require('datauri');
const path = require('path');
cloudinary.config({
    cloud_name: jsonConfig['development'].cloudinary.cloud_name,
    api_key: jsonConfig['development'].cloudinary.api_key,
    api_secret: jsonConfig['development'].cloudinary.api_secret
})

async function uploadMultiple(files) {
    const urls = []
    for (const file of files) {
        const dUri = new datauri();
        const dataUri = file => dUri.format(path.extname(file.originalname).toString(), file.buffer);
        const formatedFile = dataUri(file).content;
        const image = await cloudinary.uploader.upload(formatedFile);
        let ob = {
            "small": image.secure_url.slice(0, 50) + 'c_scale,h_135,w_180/' + image.secure_url.slice(50),
            "medium": image.secure_url.slice(0, 50) + 'c_scale,h_360,w_480/' + image.secure_url.slice(50),
            "large": image.secure_url.slice(0, 50) + 'c_scale,h_720,w_960/' + image.secure_url.slice(50),
            "original": image.secure_url
        };
        urls.push(ob);
    }
    return urls;
}

module.exports = {
    uploadMultiple
};