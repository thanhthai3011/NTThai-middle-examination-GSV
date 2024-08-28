import axios from "axios";
import models from "../../../infra/sequelize/models";

export class SyncAssetCronJob {
  constructor() {}

  async autoSyncDataAsset(): Promise<void> {
    console.log(`Start sync data `);
    const responseData: any = {};
    const currentTimestamp = Math.floor(Date.now() / 1000);
    try {
      const res = await axios({
        method: "get",
        url: "https://669ce22d15704bb0e304842d.mockapi.io/assets",
        headers: {},
      });
      console.log(res.data);
      if (res.data.length > 0) {
        const filteredAssets = res.data.filter(
          (asset) =>
            asset.status === "actived" && asset.created_at <= currentTimestamp
        );
        if (filteredAssets.length > 0) {
          for (const asset of filteredAssets) {
            const location = await models.sequelize.query(
              `SELECT "id","status"
                     FROM locations 
                     WHERE "id" = '${asset.location_id}' AND "status" = 'actived'`,
              { type: models.sequelize.QueryTypes.SELECT }
            );
            console.log(location);
            if (location.length > 0) {
              const t = await models.sequelize.transaction();
              try {
                await models.sequelize.query(
                  `INSERT INTO assets (location_id, type, serial, status, description)
                   VALUES (:locationId, :type, :serial, :status, :description)`,
                  {
                    replacements: {
                      locationId: asset.location_id,
                      type: asset.type,
                      serial: asset.serial,
                      status: asset.status,
                      description: asset.description,
                    },
                    type: models.sequelize.QueryTypes.INSERT,
                    transaction: t,
                  }
                );
                await t.commit();
                console.log("Asset inserted successfully");
              } catch (error) {
                await t.rollback();
                console.error("Failed to insert asset:", error);
                throw error; // Rethrow to handle it in the outer catch block if needed
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    return responseData;
  }
}
