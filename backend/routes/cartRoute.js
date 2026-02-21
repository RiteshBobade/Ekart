import express from "express";
import { isAuthenticated } from "../middleware/authenticated.js";
import { addTocart, getCart, removeFromCart, updateQuantity } from "../controllers/cartController.js";


const router = express.Router();

router.get('/',isAuthenticated, getCart);
router.post('/add',isAuthenticated, addTocart)
router.put('/update', isAuthenticated, updateQuantity)
router.delete('/remove', isAuthenticated, removeFromCart)



export default router;