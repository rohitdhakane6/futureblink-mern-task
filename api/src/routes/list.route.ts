import express from "express";
import {
  createList,
  getListById,
  deleteList,
  updateList,
  getLists} from "../controllers/list.controller";

const router = express.Router();

router.post("/", createList);
router.get("/", getLists);
router.get("/:id", getListById);
router.delete("/:id", deleteList);
router.put("/:id", updateList);

export default router;
