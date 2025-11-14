import express from "express";
import { createMeasurement } from "../controllers/createMeasurement.js";
import { deleteMeasurement } from "../controllers/deleteMeasurement.js";
import { getMeasurements } from "../controllers/getMeasurements.js";
import { getAllMeasurements } from "../controllers/getAllMeasurements.js";
import { getMeasurement } from "../controllers/getMeasurement.js";
import { createUser } from "../controllers/createUser.js";
import { getAllOrders } from "../controllers/getAllOrders.js"
import { getOrders } from "../controllers/getOrders.js"
import { updateMeasurement } from "../controllers/updateMeasurement.js";
import { createOrder } from "../controllers/createOrder.js";
import { updateOrder } from "../controllers/updateOrder.js";
import { deleteOrder } from "../controllers/deleteOrder.js";
import { getAllCustomers } from "../controllers/getAllCustomers.js";
import { updateCustomer } from "../controllers/updateCustomer.js";
import { deleteCustomer } from "../controllers/deleteCustomer.js";

const router = express.Router();

router.post("/createMeasurement/:user_id/:customer_id", createMeasurement);
router.post("/addMeasurement/:user_id/:customer_id", createMeasurement); // Alias for frontend compatibility
router.get("/getAllMeasurements/:user_id", getAllMeasurements);
router.get("/getMeasurements/:user_id/:customer_id", getMeasurements);
router.delete("/deleteMeasurement/:user_id/:customer_id/:measurement_id", deleteMeasurement);
router.get("/getMeasurement/:user_id/:customer_id/:measurement_id", getMeasurement);
router.put("/updateMeasurement/:user_id/:customer_id/:measurement_id", updateMeasurement);

router.post("/createUser", createUser);

router.get("/getAllOrders/:user_id", getAllOrders);
router.get("/getOrders/:user_id/:customer_id", getOrders);
router.post("/createOrder/:user_id/:customer_id", createOrder);
router.post("/updateOrder/:user_id/:order_id", updateOrder);
router.delete("/deleteOrder/:user_id/:order_id", deleteOrder);

router.get("/getAllCustomers/:user_id", getAllCustomers);
router.put("/updateCustomer/:user_id/:customer_id", updateCustomer);
router.delete("/deleteCustomer/:user_id/:customer_id", deleteCustomer);

export default router; 