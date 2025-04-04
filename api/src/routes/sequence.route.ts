import express from "express";
import{
    createSequence,
    getSequenceById,
    // deleteSequence,
    // updateSequence,
    getSequences} from
    "../controllers/sequence.controller";


const router = express.Router();

router.post("/", createSequence);
router.get("/", getSequences);
router.get("/:id", getSequenceById);
// router.delete("/:id", deleteSequence);
// router.put("/:id", updateSequence);

export default router;
