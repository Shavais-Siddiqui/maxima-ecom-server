const express = require('express');
const router = express.Router();
const jwt = require('./utils/jwt');
const UserController = require('./controllers/userController');
const CateogryController = require('./controllers/categoryController');
const ProductController = require('./controllers/productController');
const ReviewController = require('./controllers/reviewController');
const SeedController = require('./controllers/seedController');

const multer = require('multer');


const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).array('images', 5);



router.get('/test', (req, res) => {
    res.send('Server Is Running!');
});

router.post('/add-user', UserController.register);
router.post('/login', UserController.login);
router.post('/verify-email/:id', UserController.emailVerification);
router.get('/get-data', jwt.verifyJwt, UserController.getData);
router.patch('/update/:id', jwt.verifyJwt, UserController.update);

// Cateogries

router.get('/all-categories', CateogryController.getAll);
router.post('/add-category', CateogryController.addNew); // Admin Specific
router.patch('/update-category/:id', CateogryController.update); // Admin Specific

// Products

router.get('/all-products', ProductController.getAll);
router.get('/specific-products/:id', ProductController.getSpecific);
router.get('/detail-product/:id', ProductController.detailProduct);
router.post('/add-product', multerUploads, ProductController.addNew); // Admin Specific
router.patch('/update-product/:id', ProductController.update); // Admin Specific

// Reviews

router.post('/add-review', ReviewController.add);

// Seed

router.get('/all-province', SeedController.allProvinces);
router.get('/specific-cities/:id', SeedController.cities);
router.get('/all-dropdowns', SeedController.getDropdowns);
router.post('/update-dropdown/:id', SeedController.updateDropdowns);

module.exports = router;