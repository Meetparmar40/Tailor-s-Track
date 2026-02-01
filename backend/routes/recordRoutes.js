import express from "express";
import { createMeasurement } from "../controllers/createMeasurement.js";
import { deleteMeasurement } from "../controllers/deleteMeasurement.js";
import { getMeasurements } from "../controllers/getMeasurements.js";
import { getAllMeasurements } from "../controllers/getAllMeasurements.js";
import { getMeasurement } from "../controllers/getMeasurement.js";
import { getAllOrders } from "../controllers/getAllOrders.js"
import { getOrders } from "../controllers/getOrders.js"
import { updateMeasurement } from "../controllers/updateMeasurement.js";
import { createOrder } from "../controllers/createOrder.js";
import { updateOrder } from "../controllers/updateOrder.js";
import { deleteOrder } from "../controllers/deleteOrder.js";
import { getAllCustomers } from "../controllers/getAllCustomers.js";
import { createCustomer } from "../controllers/createCustomer.js";
import { updateCustomer } from "../controllers/updateCustomer.js";
import { deleteCustomer } from "../controllers/deleteCustomer.js";
import { getOrder } from "../controllers/getOrder.js";
import { getCustomer } from "../controllers/getCustomer.js";
import { syncUser } from "../controllers/clerkWebhook.js";
import { getSettings } from "../controllers/getSettings.js";
import { updateSettings } from "../controllers/updateSettings.js";
import { getAdmins, getUserWorkspaces } from "../controllers/getAdmins.js";
import { addAdmin, updateAdmin, removeAdmin } from "../controllers/addAdmin.js";
import { switchWorkspace } from "../controllers/switchWorkspace.js";

const router = express.Router();

router.post("/syncUser", syncUser);

router.post("/createMeasurement/:user_id/:customer_id", createMeasurement);
router.post("/addMeasurement/:user_id/:customer_id", createMeasurement); // Alias for frontend compatibility
router.get("/getAllMeasurements/:user_id", getAllMeasurements);
router.get("/getMeasurements/:user_id/:customer_id", getMeasurements);
router.delete("/deleteMeasurement/:user_id/:customer_id/:measurement_id", deleteMeasurement);
router.get("/getMeasurement/:user_id/:customer_id/:measurement_id", getMeasurement);
router.put("/updateMeasurement/:user_id/:customer_id/:measurement_id", updateMeasurement);

router.get("/getAllOrders/:user_id", getAllOrders);
router.get("/getOrders/:user_id/:customer_id", getOrders);
router.post("/createOrder/:user_id/:customer_id", createOrder);
router.post("/updateOrder/:user_id/:order_id", updateOrder);
router.delete("/deleteOrder/:user_id/:order_id", deleteOrder);

router.get("/getAllCustomers/:user_id", getAllCustomers);
router.post("/createCustomer/:user_id", createCustomer);
router.put("/updateCustomer/:user_id/:customer_id", updateCustomer);
router.delete("/deleteCustomer/:user_id/:customer_id", deleteCustomer);
router.get("/getOrder/:user_id/:order_id", getOrder);
router.get("/getCustomer/:user_id/:customer_id", getCustomer);

// Settings routes
router.get("/getSettings/:user_id", getSettings);
router.put("/updateSettings/:user_id", updateSettings);

// Admin management routes
router.get("/getAdmins/:user_id", getAdmins);
router.get("/getUserWorkspaces/:user_id", getUserWorkspaces);
router.post("/addAdmin/:user_id", addAdmin);
router.put("/updateAdmin/:user_id/:admin_id", updateAdmin);
router.delete("/removeAdmin/:user_id/:admin_id", removeAdmin);
router.post("/switchWorkspace/:user_id/:target_user_id", switchWorkspace);

export default router; 