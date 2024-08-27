import { Op } from "sequelize";

export class ApiFeatures {
    private query: any;
    private objQuery: object = {};
    constructor(query: any) {
        this.query = query;
        if (!this.query["page"]) {
            this.query.page = 1;
        }
        if (!this.query["page_size"]) {
            this.query.page_size = 20;
        }
    }

    filter(where = {}) {
        // if (this.query?.search) {
        //     const valueSearch: string = condition["value"].normalize("NFD")
        //             .replace(/[\u0300-\u036f]/g, "")
        //             .toLowerCase();
        //     this.objQuery["where"] = { [`${condition["prefix"]}_search`]: { [Op.like]: `%${valueSearch}%` } };
        //     return this;
        // }
        this.objQuery["where"] = where;
        return this;
    }

    sort(sortField = "createdAt", sortOrder = "DESC", prefix = "") {
        if (this.query?.sort_field) {
            sortField = `${prefix}_${sortField}`;
        }
        this.objQuery["order"] = [[sortField, sortOrder]];
        return this;
    }

    limitFields(prefix = "", arrCheck = []) {
        if (this.query?.fields) {
            const fields = this.query.fields.split(",").filter((field: never) => !arrCheck.includes(field));
            const prefixedFields = fields.map((field) => `${prefix}_${field}`);
            this.objQuery["attributes"] = prefixedFields;
        }
        return this;
    }

    paranoid(paranoid = false) {
        this.objQuery["paranoid"] = paranoid;
        return this;
    }

    includes(includes = []) {
        this.objQuery["include"] = includes;
        return this;
    }

    paginate() {
        const page = this.query?.page;
        const pageSize = this.query?.page_size;
        const offset = (page - 1) * pageSize;
        this.objQuery["limit"] = pageSize;
        this.objQuery["offset"] = offset;
        return this;
    }

    getObjQuery() {
        return this.objQuery;
    }
}
