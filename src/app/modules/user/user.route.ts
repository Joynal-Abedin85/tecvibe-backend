import express from "express"
import { createReturnRequest, getRefundStatus, usercontroller } from "./user.controller"
import { auth } from "../../middleware/auth";


const router = express.Router()



// Profile
router.get("/profile", auth, usercontroller.getprofile);
router.put("/profile", auth, usercontroller.updateProfile);

// Orders
router.get("/orders", auth, usercontroller.getOrders);
router.get("/orders/:id", auth, usercontroller.getOrderById);
router.post("/orders", auth, usercontroller.createOrder);
router.get("/orders/:id/track", auth, usercontroller.trackOrder);

// Cart
router.post("/cart", auth, usercontroller.addToCart);
router.get("/cart", auth, usercontroller.getCart);
router.put("/cart/:id", auth, usercontroller.updateCartItem);
router.delete("/cart/:id", auth, usercontroller.deleteCartItem);

// Wishlist
router.post("/wishlist", auth, usercontroller.addWishlist);
router.get("/wishlist", auth, usercontroller.getWishlist);
router.delete("/wishlist/:id", auth, usercontroller.deleteWishlistItem);

// Reviews
router.post("/products/:id/review", auth, usercontroller.addReview);
router.get("/products/:id/review", usercontroller.getReviews);

// Questions
router.post("/products/:id/question", auth, usercontroller.addQuestion);
router.get("/products/:id/question", usercontroller.getQuestions);

// return request
router.post("/:id/return", auth, createReturnRequest);

// get refund status
router.get("/:id/refund", auth, getRefundStatus);





export const    userorute = router