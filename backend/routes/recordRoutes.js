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
import {
    requireAuthenticatedUser,
    requireSelf,
    requireWorkspaceAccess,
} from "../middleware/clerkAuth.js";

import { getAdmins, getUserWorkspaces } from "../controllers/getAdmins.js";
import { addAdmin, updateAdmin, removeAdmin } from "../controllers/addAdmin.js";
import { switchWorkspace } from "../controllers/switchWorkspace.js";

const router = express.Router();

router.use(requireAuthenticatedUser);

router.post("/syncUser", syncUser);

router.post("/createMeasurement/:user_id/:customer_id", requireWorkspaceAccess, createMeasurement);
router.post("/addMeasurement/:user_id/:customer_id", requireWorkspaceAccess, createMeasurement); // Alias for frontend compatibility
router.get("/getAllMeasurements/:user_id", requireWorkspaceAccess, getAllMeasurements);
router.get("/getMeasurements/:user_id/:customer_id", requireWorkspaceAccess, getMeasurements);
router.delete("/deleteMeasurement/:user_id/:customer_id/:measurement_id", requireWorkspaceAccess, deleteMeasurement);
router.get("/getMeasurement/:user_id/:customer_id/:measurement_id", requireWorkspaceAccess, getMeasurement);
router.put("/updateMeasurement/:user_id/:customer_id/:measurement_id", requireWorkspaceAccess, updateMeasurement);

router.get("/getAllOrders/:user_id", requireWorkspaceAccess, getAllOrders);
router.get("/getOrders/:user_id/:customer_id", requireWorkspaceAccess, getOrders);
router.post("/createOrder/:user_id/:customer_id", requireWorkspaceAccess, createOrder);
router.post("/updateOrder/:user_id/:order_id", requireWorkspaceAccess, updateOrder);
router.delete("/deleteOrder/:user_id/:order_id", requireWorkspaceAccess, deleteOrder);
router.get("/getOrder/:user_id/:order_id", requireWorkspaceAccess, getOrder);

router.get("/getAllCustomers/:user_id", requireWorkspaceAccess, getAllCustomers);
router.post("/createCustomer/:user_id", requireWorkspaceAccess, createCustomer);
router.put("/updateCustomer/:user_id/:customer_id", requireWorkspaceAccess, updateCustomer);
router.delete("/deleteCustomer/:user_id/:customer_id", requireWorkspaceAccess, deleteCustomer);
router.get("/getCustomer/:user_id/:customer_id", requireWorkspaceAccess, getCustomer);

// Settings routes
router.get("/getSettings/:user_id", requireSelf, getSettings);
router.put("/updateSettings/:user_id", requireSelf, updateSettings);

// Admin management routes
router.get("/getAdmins/:user_id", requireWorkspaceAccess, getAdmins);
router.get("/getUserWorkspaces/:user_id", requireSelf, getUserWorkspaces);
router.post("/addAdmin/:user_id", requireSelf, addAdmin);
router.put("/updateAdmin/:user_id/:admin_id", requireSelf, updateAdmin);
router.delete("/removeAdmin/:user_id/:admin_id", requireSelf, removeAdmin);
router.post("/switchWorkspace/:user_id/:target_user_id", requireSelf, switchWorkspace);

export default router; 
