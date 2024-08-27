import express from "express";

const router = express.Router();

router.get("/", async (req, res) => res.json({ message: "OK", data: "" }));

export { router };
