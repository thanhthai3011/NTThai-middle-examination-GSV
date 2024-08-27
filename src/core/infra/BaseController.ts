import * as express from "express";

export abstract class BaseController {
    protected abstract executeImpl(req: express.Request, res: express.Response): Promise<void | any>;

    public handleSequelizeUniqueConstraintError(res: express.Response, err: any){
        const { parent, errors } = err;
        switch (errors[0].path) {
            case "tu_email":
                this.conflict(res, `${errors[0].path} has taken`);
                break;
            default:
                this.conflict(res, `${errors[0].path} has taken`);
                break;
        }
    }

    public handleSequelizeForeignKeyConstraintError(res: express.Response, err: any){
        const { parent } = err;
        if (parent?.detail.indexOf("bu_type") !== -1) {
            return this.clientError(res, "This type id is not present in table");
        }
        if (parent?.detail.indexOf("tu_role_id") !== -1) {
            return this.clientError(res, "This role id is not present in table");
        }
        if (parent?.detail.indexOf("c_business_id") !== -1) {
            return this.clientError(res, "This business id is not present in table");
        }
        return  this.clientError(res, parent?.detail || err);
    }

    public async execute(req: express.Request, res: express.Response): Promise<void> {
        try {
            await this.executeImpl(req, res);
        } catch (err) {
            console.log(`[BaseController]: Uncaught controller error`);
            console.log(err);
            Logger.info(`Error ${JSON.stringify(err)}`);

            const { parent } = err;
            switch (parent?.code) {
                case "23505":
                    // name: SequelizeUniqueConstraintError
                    this.handleSequelizeUniqueConstraintError(res, err);
                    break;
                case "23503":
                    // name: SequelizeForeignKeyConstraintError
                    // Lỗi này xảy ra khi một thao tác vi phạm ràng buộc khóa ngoại.
                    // Ví dụ: Khi bạn cố gắng thêm một bản ghi vào bảng Orders với userId không tồn tại trong bảng Users.
                    this.handleSequelizeForeignKeyConstraintError(res, err);
                    break;
                case "42703":
                    this.clientError(res, "Attempted to access a non-existent column. Please check the column name and table schema." || err);
                    break;
                case "22007": 
                    // name: SequelizeDatabaseError
                    // 22007: invalid_datetime_format
                    // Cú pháp truy vấn SQL không đúng.
                    // Lỗi trong cấu hình kết nối cơ sở dữ liệu.
                    this.clientError(res, "Invalid date format" || err);
                    break;
                default:
                    this.clientError(res, parent?.detail || err);
                    break;
            }
        }
    }

    public static jsonResponse(res: express.Response, statusCode: number, code: number, message: string, data?: any) {
        return res.status(statusCode).json({ code, message, data });
    }

    public okPaginate<T>(res: express.Response, page: number = 1, pageSize: number = 20, pageCount:number = 1, totalItems: number, dto: T, total: number, message: string = "Success") {
        if (dto) {
            res.type("application/json");
            return res.status(200).json({ code: 1, message, page, page_size: pageSize, page_count: pageCount, total_items: totalItems, data: dto  });
        } else {
            return res.sendStatus(200);
        }
    }

    public ok<T>(res: express.Response, dto?: T, message: string = "Success") {
        if (dto) {
            res.type("application/json");
            return BaseController.jsonResponse(res, 200, 1, message, dto);
        } else {
            return res.sendStatus(200);
        }
    }

    public deleted(res: express.Response,  data: any = null, message: string = "Success") {
        return BaseController.jsonResponse(res, 204, 1, message, data);
    }

    public created(res: express.Response,  data: any = null, message: string = "Success") {
        return BaseController.jsonResponse(res, 201, 1, message, data);
    }

    public clientError(res: express.Response, message: string = "", data: any = null, status_code: number = 422) {
        return BaseController.jsonResponse(res, status_code, 0, message);
    }

    public unauthorized(res: express.Response, message: string = "Unauthorized") {
        return BaseController.jsonResponse(res, 401, 0, message, null);
    }

    public forbidden(res: express.Response, message: string = "Forbidden") {
        return BaseController.jsonResponse(res, 403, 0, message, null);
    }

    public notFound(res: express.Response, message: string = "",  data: any = null) {
        return BaseController.jsonResponse(res, 404, 0, message, data);
    }

    public conflict(res: express.Response, message: string = "", data: any = null) {
        return BaseController.jsonResponse(res, 409, 0, message, data);
    }

    public fail(res: express.Response, error: Error | string) {
        return BaseController.jsonResponse(res, 500, 0, error.toString(), null);
    }
}
