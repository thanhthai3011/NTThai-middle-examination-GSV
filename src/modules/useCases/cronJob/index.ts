import { SyncAssetCronJob } from "./syncAssetCronJob";

import dotenv from "dotenv";
dotenv.config();


const CronJob = require("cron").CronJob;

const threeMinute = "*/3 * * * *";

const midnight = "0 17 * * *";

const autoSyncDataAssetModel = new CronJob(midnight, async function () {
    console.log(`-----Start Auto Sync-----`);

    try {
        await new SyncAssetCronJob().autoSyncDataAsset();
    } catch (error) {
        console.log(JSON.stringify(error));
    }

    console.log(`-----End Auto Sync-----`);
});

autoSyncDataAssetModel.start();


