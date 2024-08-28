import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, left, Result, right } from "../../../../core/logic/Result";
import { ApiFeatures } from "../../../../utils/api_features";
import { ILocationRepo } from "../../../repos/interface/location.interface";
import models from "../../../../infra/sequelize/models";
import { Op } from "sequelize";

type Response = Either<GenericAppError.UnexpectedError, any>;

class GetLocationPages implements UseCase<any, Response> {
  private readonly _locationRepo: ILocationRepo;

  constructor(locationRepo: ILocationRepo) {
    this._locationRepo = locationRepo;
  }

  public async execute(req, res): Promise<any> {
    console.log(`BEGIN >> Query: ${JSON.stringify(req.query)}`);
    const query = { ...req.query };
    const queryObject = {
      name: query.name,
    };

    const conditions = {};
    const arrQueryObject = Object.entries(queryObject).map((item) => {
      return {
        key: item[0],
        value: item[1],
      };
    });

    for (let index = 0; index < arrQueryObject.length; index++) {
      switch (arrQueryObject[index].key) {
        case "name":
          const name =
            typeof arrQueryObject[index].value === "string"
              ? [arrQueryObject[index].value]
              : arrQueryObject[index].value;
          if (Array.isArray(name)) {
            conditions["name"] = {
              [Op.substring]: name,
            };
          }
          break;
        default:
          break;
      }
    }
    const objQuery = new ApiFeatures(query)
      .filter(conditions)
      .sort(query.sort_field || "created_at", query.sort_order || "DESC")
      .limitFields()
      .paginate()
      .paranoid()
      .includes()
      .getObjQuery();
    console.log(`Query: ${JSON.stringify(objQuery)}`);

    const { count, rows }: any = await this._locationRepo.findPages(objQuery);
    const locations = rows.length > 0 ? rows : [];

    const result = {
      page: Number(query?.page) * 1,
      pageSize: Number(query?.page_size) * 1,
      totalItems: count || 0,
      locations: locations,
    };

    console.log(`END << Location Page ${JSON.stringify(result)}`);
    return right(Result.ok(result));
  }
}

export { GetLocationPages };
