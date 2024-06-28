const cloudinary = require('cloudinary');

const cloudCloudinary = cloudinary.v2;
cloudCloudinary.config({
    cloud_name: 'hathanhtuan',
    api_key: '744323586139521',
    api_secret: 'Ie74f7LfKlQ9O4Iqw6my7XDHsLo',
    secure: true
});
module.exports = cloudCloudinary;
