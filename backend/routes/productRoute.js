import express from "express";
import { addProduct, getAllProduct } from "../controllers/productController.js";
import { isAdmin, isAuthenticated } from "../middleware/authenticated.js";
import { multipleUpload } from "../middleware/multer.js";


const router = express.Router();

router.post('/add',isAuthenticated, isAdmin, multipleUpload, addProduct);
router.get('/getallproducts', getAllProduct)



export default router;