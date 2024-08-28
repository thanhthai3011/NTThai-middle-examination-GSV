import express from "express";
import { organizationRoute } from "../../../../modules/infra/http/routes/organization.route";
import { locationRoute } from "../../../../modules/infra/http/routes/location.route";
import { deviceRoute } from "../../../../modules/infra/http/routes/device.route";
import { assetRoute } from "../../../../modules/infra/http/routes/asset.route";

const router = express.Router();

router.get("/", async (req, res) => res.json({ message: "OK", data: "" }));

router.use("/api", organizationRoute);
router.use("/api", locationRoute);
router.use("/api", deviceRoute);
router.use("/api", assetRoute);
export { router };
