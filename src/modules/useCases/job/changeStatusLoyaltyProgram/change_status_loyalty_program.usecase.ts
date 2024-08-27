import { Op } from "sequelize";
import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either } from "../../../../core/logic/Result";
import logger from "../../../../utils/logger";
import models from "../../../../infra/sequelize/models";
import { BenefitStatuses, BenefitTypeStatuses, LoyaltyProgramStatuses } from "../../../../infra/sequelize/config/enum";
import { IBenefit, IBenefitType, ILoyaltyProgram } from "../interface/change_status.interface";

type Response = Either<GenericAppError.UnexpectedError, any>;

class ChangeStatusLoyaltyProgram implements UseCase<any, Response> {
    public async execute(req): Promise<any> {
        logger.info(`Start Update Status Loyalty Program `);
        const currentDate: string = new Date().toISOString().slice(0, 10);
        console.log(currentDate);
        const responseData: any = {};

        try {
            const loyaltyPrograms = await models.sequelize.query(
                `SELECT
	                    "lpg_id",
                        "lpg_status"
                    FROM
	                    loyalty_programs
                    WHERE
                        "lpg_status" = 'Activated'
                        AND TO_CHAR("lpg_program_end_date", 'YYYY-MM-DD') <= '${currentDate}'
                    `,
                { type: models.sequelize.QueryTypes.SELECT },
            );

            logger.debug(`List loyPrograms to Deactivated : ${JSON.stringify(loyaltyPrograms)}`);

            const idsProgram = loyaltyPrograms
                .map((item: ILoyaltyProgram) => {
                    return `'${item.lpg_id}'`;
                })
                .toString();

            if (loyaltyPrograms.length) {
                const t_loyalty_program_deactivated = await models.sequelize.transaction();
                responseData["loyProgramsToDeactive"] = loyaltyPrograms;
                await models.sequelize
                    .query(
                        `UPDATE
                            loyalty_programs
                            SET
                                "t_loyalProg_status" = '${LoyaltyProgramStatuses.Deactivated}'
                            WHERE
                                "t_loyalProg_id" IN (${idsProgram});`,
                        {
                            type: models.sequelize.QueryTypes.UPDATE,
                            transaction: t_loyalty_program_deactivated,
                        },
                    )
                    .then(async ([res, { rowCount }]) => {
                        const benefitTypes = await models.sequelize.query(
                            `SELECT
	                                "bt_id",
                                    "bt_status"
                                FROM
	                                benefit_types
                                INNER JOIN loyalty_programs ON loyalty_programs."lpg_id" = benefit_types."bt_loyalty_program_id"
                                WHERE  benefit_types."bt_status" = '${BenefitTypeStatuses.Activated}'
                                    AND loyalty_programs."lpg_status" = '${LoyaltyProgramStatuses.Deactivated}'
                    `,
                            { type: models.sequelize.QueryTypes.SELECT },
                        );

                        logger.debug(`List Benefits types (Loyalty Program) To Deactivated : ${JSON.stringify(benefitTypes)}`);

                        const idsBenefitType = benefitTypes
                            .map((item: IBenefitType) => {
                                return `'${item.bt_id}'`;
                            })
                            .toString();

                        if (benefitTypes.length) {
                            // Update status benefit types

                            const t_benefit_types_deactivated = await models.sequelize.transaction();

                            await models.sequelize
                                .query(
                                    `UPDATE
                                    benefit_types
                                    SET
                                        "bt_status" = '${BenefitTypeStatuses.Deactivated}'
                                    WHERE
                                        "bt_id" IN (${idsBenefitType});`,
                                    {
                                        type: models.sequelize.QueryTypes.UPDATE,
                                        transaction: t_benefit_types_deactivated,
                                    },
                                )
                                .then(async ([res, { rowCount }]) => {
                                    responseData["benfTypeToDeactive"] = benefitTypes;
                                    // Update status benefits
                                    const benefits = await models.sequelize.query(
                                        `SELECT
                                        "be_id",
                                        "be_status"
                                        FROM
                                            benefits
                                        INNER JOIN benefit_types ON benefits."be_benefit_type_id" = benefit_types."bt_id"                                           
                                        WHERE  benefits."be_status" = '${BenefitStatuses.Activated}'
                                            AND loyalty_programs."lpg_status" = '${LoyaltyProgramStatuses.Deactivated}'
                                    `,
                                        { type: models.sequelize.QueryTypes.SELECT },
                                    );

                                    logger.debug(`List Benefits : ${JSON.stringify(benefits)}`);

                                    if (benefits.length) {
                                        const idsBenefits = benefits
                                            .map((item: IBenefit) => {
                                                return `'${item.be_id}'`;
                                            })
                                            .toString();

                                        const t_benefit_deactivated = await models.sequelize.transaction();

                                        await models.sequelize
                                            .query(
                                                `UPDATE
                                            benefits
                                            SET
                                                "be_status" = '${BenefitStatuses.Deactivated}'
                                            WHERE
                                                "be_id" IN (${idsBenefits});`,
                                                {
                                                    type: models.sequelize.QueryTypes.UPDATE,
                                                    transaction: t_benefit_deactivated,
                                                },
                                            )
                                            .then(async ([res, { rowCount }]) => {
                                                logger.debug(`List benefits (Loyalty Program) To Deactivated : ${JSON.stringify(benefits)}`);
                                                responseData["benfToDeactive"] = benefits;
                                            });
                                    }
                                });
                        }
                    });
            }
            const loyaltyProgramActivated = await models.LoyaltyProgram.findAll({
                where: { t_loyalProg_status: LoyaltyProgramStatuses.Activated },
            });

            logger.info(`${JSON.stringify(loyaltyProgramActivated)}`);

            if (loyaltyProgramActivated.length < 1) {
                const loyaltyPrograms = await models.sequelize.query(
                    `SELECT * FROM loyalty_programs lpr
                    WHERE 1=1
                            AND lpr."lpg_status" = '${LoyaltyProgramStatuses.Draft}'
                            AND TO_CHAR(lpr."lpg_program_start_date", 'YYYY-MM-DD') <= '${currentDate}'
                            `,
                    {
                        type: models.sequelize.QueryTypes.SELECT,
                    },
                );

                logger.debug(`List loyPrograms has min loyalty_currency : ${JSON.stringify(loyaltyPrograms)}`);

                if (loyaltyPrograms.length) {
                    const t_loyalty_program_activated = await models.sequelize.transaction();

                    const id = loyaltyPrograms[0]["t_loyalProg_id"];

                    await models.sequelize
                        .query(
                            `UPDATE loyalty_programs lpr
                                SET "lpg_status" = 'Activated'
                                WHERE lpr."lpg_id" = '${id}'
                                AND lpr."lpg_status" != '${LoyaltyProgramStatuses.Deactivated}'
                                RETURNING lpr."lpg_id", lpr."lpg_status"; `,
                            {
                                type: models.sequelize.QueryTypes.UPDATE,
                                transaction: t_loyalty_program_activated,
                            },
                        )
                        .then(async ([res, { rowCount }]) => {
                            logger.debug(`List loyPrograms to Activated : ${JSON.stringify(loyaltyPrograms)}`);
                            responseData["loyProgramsToActive"] = loyaltyPrograms;
                        });

                    logger.info(`- Stop Update Status Loyalty Program to Activated`);
                }
            }

            return responseData;
        } catch (error) {
            logger.error(JSON.stringify(error));
        }

        logger.info(`Stop Update Status Loyalty Program`);
    }
}

export { ChangeStatusLoyaltyProgram };
