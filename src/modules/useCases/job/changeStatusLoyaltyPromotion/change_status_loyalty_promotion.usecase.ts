import { Op } from "sequelize";
import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either } from "../../../../core/logic/Result";
import logger from "../../../../utils/logger";
import models from "../../../../infra/sequelize/models";
import { LoyaltyPromotionStatuses, VoucherDefinitionStatuses, VoucherStatuses } from "../../../../infra/sequelize/config/enum";
import { ILoyaltyPromotion, IVoucher, IVoucherDef } from "../interface/change_status.interface";

type Response = Either<GenericAppError.UnexpectedError, any>;

class ChangeStatusLoyaltyPromotion implements UseCase<any, Response> {
    public async execute(req): Promise<any> {
        logger.info(`Start Update Status Loyalty Promotion `);
        const currentDate: string = new Date().toISOString().slice(0, 10);
        console.log(currentDate);
        const responseData: any = {};

        let loyPromotionsActivated: ILoyaltyPromotion[] = [];
        let loyPromotionsDeactivated: ILoyaltyPromotion[] = [];

        const t_loyalty_promotion_deactivated = await models.sequelize.transaction();

        // Update status LoyaltyPromotionStatuses.Activated
        logger.info(`- Start Update Loyalty Promotion to Activated`);

        loyPromotionsActivated = await models.sequelize.query(
            `SELECT
                    "lpm_id",
                    "lpm_status"
                FROM
                    loyalty_promotions
                WHERE
                    "lpm_status" = '${LoyaltyPromotionStatuses.Draft}'
                    AND TO_CHAR("lpm_v_start_date", 'YYYY-MM-DD') <= '${currentDate}'
                `,
            { type: models.sequelize.QueryTypes.SELECT },
        );

        const idsLoyPromotionsActivated = loyPromotionsActivated
            .map((item) => {
                return `'${item.lpm_id}'`;
            })
            .toString();

        logger.debug(`List Loyalty Promotion To Activated : ${JSON.stringify(loyPromotionsActivated)}`);

        if (loyPromotionsActivated.length) {
            const t_loyalty_promotion_activated = await models.sequelize.transaction();

            await models.sequelize
                .query(
                    `UPDATE
                    loyalty_promotions 
                SET
                    "lpm_status" = '${LoyaltyPromotionStatuses.Activated}'
                WHERE
                    "lpm_id" IN (${idsLoyPromotionsActivated});`,
                    {
                        type: models.sequelize.QueryTypes.UPDATE,
                        transaction: t_loyalty_promotion_activated,
                    },
                )
                .then(async (result: any) => {
                    responseData["loyPromotionsToActive"] = loyPromotionsActivated;
                    const idsLoyPromotionsActivated = loyPromotionsActivated
                        .map((item) => {
                            return `'${item.lpm_id}'`;
                        })
                        .toString();

                    // Update status voucher_definition
                    if (idsLoyPromotionsActivated.length > 0) {
                        const voucherDefs = await models.sequelize.query(
                            `SELECT
                            "vd_id",
                            "vd_status"
                        FROM
                            voucher_definitions
                            INNER JOIN loyalty_promotions ON voucher_definitions."vd_loyalty_promotion_id" = loyalty_promotions."lpm_id"
                            INNER JOIN loyalty_programs ON voucher_definitions."vd_loyalty_program_id" = loyalty_programs."lpg_id"
                        WHERE
                            voucher_definitions."vd_status" = '${VoucherDefinitionStatuses.Draft}'
                            AND loyalty_promotions."lpm_status" = '${LoyaltyPromotionStatuses.Activated}'
                            AND voucher_definitions."vd_loyalty_promotion_id" IN (${idsLoyPromotionsActivated})
                        `,
                            {
                                type: models.sequelize.QueryTypes.SELECT,
                            },
                        );

                        const idsVoucherDef = voucherDefs
                            .map((item: IVoucherDef) => {
                                return `'${item.vd_id}'`;
                            })
                            .toString();

                        logger.debug(`List Voucher Definitions To Activated : ${JSON.stringify(voucherDefs)}`);

                        if (voucherDefs.length) {
                            const t_voucher_def = await models.sequelize.transaction();

                            await models.sequelize
                                .query(
                                    `UPDATE
                                voucher_definitions 
                            SET
                                "vd_status" = '${VoucherDefinitionStatuses.Activated}'
                            WHERE
                                "vd_id" IN (${idsVoucherDef})
                        `,
                                    {
                                        type: models.sequelize.QueryTypes.UPDATE,
                                        transaction: t_voucher_def,
                                    },
                                )
                                .then(async ([res, { rowCount }]) => {
                                    responseData["vouchrDefToActive"] = voucherDefs;

                                    const vouchers = await models.sequelize.query(
                                        `SELECT
                                    "v_id",
                                    "v_status"
                                FROM
                                    vouchers
                                WHERE vouchers."v_status" = '${VoucherStatuses.Issued}'
                                    AND vouchers."v_voucher_definition_id" IN(${idsVoucherDef})
                        `,
                                        { type: models.sequelize.QueryTypes.SELECT },
                                    );

                                    logger.debug(`List vouchers (Loyalty Promotion) To Canceled : ${JSON.stringify(vouchers)}`);

                                    const idsVouchers = vouchers
                                        .map((item: IVoucher) => {
                                            return `'${item.v_id}'`;
                                        })
                                        .toString();

                                    if (vouchers.length) {
                                        const t_vouchers = await models.sequelize.transaction();

                                        await models.sequelize
                                            .query(
                                                `
                                    UPDATE
                                        vouchers 
                                    SET
                                        "v_status" = '${VoucherStatuses.Void}'
                                    WHERE
                                        "v_id" IN (${idsVouchers})`,
                                                {
                                                    type: models.sequelize.QueryTypes.UPDATE,
                                                    transaction: t_vouchers,
                                                },
                                            )
                                            .then(async ([res, { rowCount }]) => {
                                                responseData["voucherToVoid"] = vouchers;
                                            });
                                    }
                                });
                        }
                    }
                })
                .catch(async (error: Error) => {
                    await t_loyalty_promotion_activated.rollback();
                    logger.debug(`Error ${JSON.stringify(error)}`);
                });
        }

        // Update status Activated LoyaltyPromotionStatuses.Deactivated
        await models.sequelize
            .query(
                `SELECT
                    "lpm_id",
                    "lpm_status"
                FROM
                    loyalty_promotions
                WHERE
                    "lpm_status" = '${LoyaltyPromotionStatuses.Activated}'
                    AND TO_CHAR("lpm_v_end_date", 'YYYY-MM-DD') <= '${currentDate}'
                `,
                { type: models.sequelize.QueryTypes.SELECT },
            )
            .then(async (result: any) => {
                const ids = result.map((item: ILoyaltyPromotion) => item.lpm_id);
                await models.LoyaltyPromotion.update(
                    { lpm_status: LoyaltyPromotionStatuses.Deactivated },
                    {
                        where: {
                            lpm_id: {
                                [Op.in]: ids,
                            },
                        },
                        returning: true,
                        transaction: t_loyalty_promotion_deactivated,
                    },
                ).then(async (result: any) => {
                    loyPromotionsDeactivated = result[1];

                    logger.debug(`List Loyalty Promotion To Deactivated : ${JSON.stringify(loyPromotionsDeactivated)}`);
                    responseData["loyPromotionsToDeactive"] = loyPromotionsDeactivated;

                    const idsLoyPromotionsDeactivated = loyPromotionsDeactivated
                        .map((item) => {
                            return `'${item.lpm_id}'`;
                        })
                        .toString();

                    // Update status voucher_definition
                    if (idsLoyPromotionsDeactivated.length > 0) {
                        const voucherDefs = await models.sequelize.query(
                            `SELECT
                            "vd_id",
                            "vd_status"
                        FROM
                            voucher_definitions
                            INNER JOIN loyalty_promotions ON voucher_definitions."vd_loyalty_promotion_id" = loyalty_promotions."lpm_id"
                            INNER JOIN loyalty_programs ON voucher_definitions."vd_loyalty_program_id" = loyalty_programs."lpg_id"
                        WHERE
                            voucher_definitions."vd_status" != '${VoucherDefinitionStatuses.Deactivated}'
                            AND loyalty_promotions."lpm_status" = '${LoyaltyPromotionStatuses.Deactivated}'
                            AND voucher_definitions."vd_loyalty_promotion_id" IN (${idsLoyPromotionsDeactivated})
                        `,
                            {
                                type: models.sequelize.QueryTypes.SELECT,
                            },
                        );

                        logger.debug(`List Voucher Definitions From Approved To Activated : ${JSON.stringify(voucherDefs)}`);

                        const idsVoucherDef = voucherDefs
                            .map((item: IVoucherDef) => {
                                return `'${item.vd_id}'`;
                            })
                            .toString();

                        logger.debug(`List Voucher Definitions To Deactivated : ${JSON.stringify(voucherDefs)}`);

                        if (voucherDefs.length) {
                            const t_voucher_def = await models.sequelize.transaction();

                            await models.sequelize
                                .query(
                                    `UPDATE
                                voucher_definitions 
                            SET
                                "vd_status" = '${VoucherDefinitionStatuses.Deactivated}'
                            WHERE
                                "vd_id" IN (${idsVoucherDef})
                        `,
                                    {
                                        type: models.sequelize.QueryTypes.UPDATE,
                                        transaction: t_voucher_def,
                                    },
                                )
                                .then(async ([res, { rowCount }]) => {
                                    responseData["vouchrDefToDeactive"] = voucherDefs;

                                    const vouchers = await models.sequelize.query(
                                        `SELECT
                                    "v_id",
                                    "v_status"
                                FROM
                                    vouchers
                                WHERE (vouchers."v_status" = '${VoucherStatuses.Issued}'
                                    OR vouchers."v_status" = '${VoucherStatuses.Extended}')
                                    AND vouchers."v_voucher_definition_id" IN(${idsVoucherDef})
                        `,
                                        { type: models.sequelize.QueryTypes.SELECT },
                                    );

                                    logger.debug(`List vouchers (Loyalty Promotion) To Canceled : ${JSON.stringify(vouchers)}`);

                                    const idsVouchers = vouchers
                                        .map((item: IVoucher) => {
                                            return `'${item.v_id}'`;
                                        })
                                        .toString();

                                    if (vouchers.length) {
                                        const t_vouchers = await models.sequelize.transaction();

                                        await models.sequelize
                                            .query(
                                                `
                                    UPDATE
                                        vouchers 
                                    SET
                                        "v_status" = '${VoucherStatuses.Cancelled}'
                                    WHERE
                                        "v_id" IN (${idsVouchers})`,
                                                {
                                                    type: models.sequelize.QueryTypes.UPDATE,
                                                    transaction: t_vouchers,
                                                },
                                            )
                                            .then(async ([res, { rowCount }]) => {
                                                responseData["voucherToCancel"] = vouchers;
                                            });
                                    }
                                });
                        }
                    }
                });
            });

        logger.info(`Update Loyalty Promotion Stop`);
        return responseData;
    }
}

export { ChangeStatusLoyaltyPromotion };
