import axios from "axios";

export class HttpClient {
    private BASE_URL: string;
    constructor(baseUrl: string) {
        this.BASE_URL = baseUrl;
    }

    async _get(path: string, params?: object, data?: object | Array<object>) {
        // const tk = await new SaleForceOauth().getConnection();
        return axios({
            method: "get",
            url: this.BASE_URL + path,
            headers: {
                // Authorization: `Bearer ${tk}`,
            },
            params: params,
            data: data,
        });
    }

    async _post(path: string, data?: object | Array<object> | string, params?: object) {
        return axios({
            method: "post",
            url: this.BASE_URL + path,
            headers: {
            },
            data: data,
            params: params,
        });
    }

    async _patch(path: string, data?: object | Array<object>, params?: object) {
        return axios({
            method: "patch",
            url: this.BASE_URL + path,
            headers: {
            },
            data: data,
            params: params,
        });
    }

    async _put(path: string, data?: object | Array<object>, params?: object) {
        return axios({
            method: "put",
            url: this.BASE_URL + path,
            headers: {
            },
            params: params,
            data: data,
        });
    }

    async _delete(path: string, params?: object, data?: object | Array<object>) {
        return axios({
            method: "delete",
            url: this.BASE_URL + path,
            headers: {
            },
            params: params,
            data: data,
        });
    }
}