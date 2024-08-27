import { Op } from "sequelize";
import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either } from "../../../../core/logic/Result";
import logger from "../../../../utils/logger";
import models from "../../../../infra/sequelize/models";
import { LoyaltyPromotionStatuses, VoucherDefinitionStatuses, VoucherStatuses } from "../../../../infra/sequelize/config/enum";
import { ILoyaltyPromotion, IVoucher, IVoucherDef } from "../interface/change_status.interface";

type Response = Either<GenericAppError.UnexpectedError, any>;

class ChangeStatusVoucherDefinition implements UseCase<any, Response> {
    public async execute(req): Promise<any> {
        logger.info(`Start Update Status Voucher Definition`);

        const responseData: any = {};
        const currentDate = new Date().toISOString().substring(0, 10);
        const voucherDefinitionsDraft = await models.sequelize.query(
            `SELECT "vd_id","vd_status"
                FROM voucher_definitions
                    WHERE
                        TO_CHAR("vd_start_date", 'YYYY-MM-DD') <= '${currentDate}'
                        AND TO_CHAR("vd_end_date", 'YYYY-MM-DD') >= '${currentDate}'
                        AND "vd_status" like '${VoucherDefinitionStatuses.Draft}%';
                    `,
            {
                type: models.sequelize.QueryTypes.SELECT,
            },
        );

        logger.debug(`List voucher Definitions From Draft To Activated : ${JSON.stringify(voucherDefinitionsDraft)}`);

        const idsVoucherDefDraft = voucherDefinitionsDraft
            .map((item: IVoucherDef) => {
                return `'${item.vd_id}'`;
            })
            .toString();

        if (voucherDefinitionsDraft.length) {
            const t = await models.sequelize.transaction();

            await models.sequelize
                .query(
                    `UPDATE
                    voucher_definitions 
                    SET
                        "vd_status" = '${VoucherDefinitionStatuses.Activated}'
                    WHERE
                        "vd_id" IN (${idsVoucherDefDraft})
                    `,
                    {
                        type: models.sequelize.QueryTypes.UPDATE,
                        transaction: t,
                    },
                )
                .then(async ([res, { rowCount }]) => {
                    logger.debug(`List Voucher Definitions To Activated : ${JSON.stringify(voucherDefinitionsDraft)}`);
                    responseData["vouchrDefToActive"] = voucherDefinitionsDraft;
                })
                .catch(async (err: Error) => {
                    logger.debug(`Error: ${JSON.stringify(err)}`);
                    await t.rollback();
                });
        }

        const voucherDefNotDeactivated = await models.sequelize.query(
            `SELECT "vd_id",
                    "vd_status"
                FROM voucher_definitions vd
                    WHERE
                        TO_CHAR(vd."vd_end_date", 'YYYY-MM-DD') <= '${currentDate}'
                        AND (vd."vd_status" != '${VoucherDefinitionStatuses.Deactivated}')
                    `,
            { type: models.sequelize.QueryTypes.SELECT },
        );

        logger.debug(`List voucher Def To Deactivated : ${JSON.stringify(voucherDefNotDeactivated)}`);

        if (voucherDefNotDeactivated.length) {
            const idsVoucherDefToDeactivated = voucherDefNotDeactivated
                .map((item: IVoucherDef) => {
                    return `'${item.vd_id}'`;
                })
                .toString();

            const t2 = await models.sequelize.transaction();

            await models.sequelize
                .query(
                    `UPDATE
                        voucher_definitions
                    SET
                        "vd_status" = '${VoucherDefinitionStatuses.Deactivated}'
                    WHERE 
                        "vd_id" IN (${idsVoucherDefToDeactivated})`,
                    {
                        type: models.sequelize.QueryTypes.UPDATE,
                        transaction: t2,
                    },
                )
                .then(async ([res, { rowCount }]) => {
                    logger.debug(`List voucher Definitions To Deactivated : ${JSON.stringify(voucherDefNotDeactivated)}`);
                    responseData["vouchrDefToDeactive"] = voucherDefNotDeactivated;

                    const vouchers = await models.sequelize.query(
                        `SELECT
                            "vd_id",
                            "vd_status"
                        FROM
                            vouchers
                            INNER JOIN voucher_definitions 
                            ON vouchers."vd_voucher_definition_id" = voucher_definitions."vd_id"
                            WHERE voucher_definitions."vd_status" = '${VoucherDefinitionStatuses.Deactivated}'
                            AND(vouchers."v_status" = '${VoucherStatuses.Issued}'
                                OR vouchers."v_status" = '${VoucherStatuses.Void}'
                                OR vouchers."v_status" = '${VoucherStatuses.Extended}')`,
                        { type: models.sequelize.QueryTypes.SELECT },
                    );

                    logger.debug(`List Vouchers To Canceled From Voucher Definition Deactivated  : ${JSON.stringify(vouchers)}`);

                    if (vouchers.length) {
                        const t3 = await models.sequelize.transaction();

                        const idsVoucherToCanceled = vouchers
                            .map((item: IVoucher) => {
                                return `'${item.v_id}'`;
                            })
                            .toString();

                        await models.sequelize
                            .query(
                                `UPDATE
                                vouchers
                            SET
                                "v_status" = '${VoucherStatuses.Cancelled}'
                            WHERE 
                                "v_id" IN (${idsVoucherToCanceled})`,
                                {
                                    type: models.sequelize.QueryTypes.UPDATE,
                                    transaction: t3,
                                },
                            )
                            .then(async ([res, { rowCount }]) => {
                                logger.debug(`List vouchers (voucher def) To Canceled : ${JSON.stringify(vouchers)}`);
                                responseData["vouchrToCanceled"] = vouchers;
                            });
                    }
                });
        }

        logger.info(`Stop Update Status Voucher Definition`);

        return responseData;
    }
}

export { ChangeStatusVoucherDefinition };
