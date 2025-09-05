import express from "express";
import { createRecord } from "../controllers/createRecord.js";
import { deleteRecord } from "../controllers/deleteRecord.js";
import { getRecords } from "../controllers/getRecords.js";
import { getRecord } from "../controllers/getRecord.js";
import { createUser } from "../controllers/createUser.js";
import { getAllOrders } from "../controllers/getAllOrders.js"
import { getOrders } from "../controllers/getOrders.js"
import { updateRecord } from "../controllers/updateRecord.js";
import { createOrder } from "../controllers/createOrder.js";
import { updateOrder } from "../controllers/updateOrder.js";
import { getAllCustomers } from "../controllers/getAllCustomers.js";

const router = express.Router();

router.post("/createRecord/:user_id/:customer_id", createRecord);
router.get("/getRecords/:user_id/:customer_id", getRecords);
router.delete("/deleteRecord/:user_id/:customer_id/:measurement_id", deleteRecord);
router.get("/getRecord/:user_id/:customer_id/:measurement_id", getRecord);
router.post("/updateRecord/:user_id/:customer_id/:measurement_id", updateRecord)

router.post("/createUser", createUser);

router.get("/getAllOrders/:user_id", getAllOrders);
router.get("/getOrders/:user_id/:customer_id", getOrders);
router.get("/getMeasurements/:user_id/:customer_id", getRecords);
router.get("/getAllCustomers/:user_id", getAllCustomers);
router.post("/createOrder/:user_id/:customer_id", createOrder);
router.post("/updateOrder/:user_id/:order_id", updateOrder);

export default router; 