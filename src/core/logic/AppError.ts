/* eslint-disable @typescript-eslint/no-namespace */
import { Result } from "./Result";
import { UseCaseError } from "./UseCaseError";

export namespace GenericAppError {
    export class UnexpectedError extends Result<UseCaseError> {
        public constructor(message: any) {
            super(false, {
                message: message,
            } as UseCaseError);
            console.log(`[AppError]: An unexpected error occurred`);
        }

        public static create(err: any): UnexpectedError {
            return new UnexpectedError(err);
        }
    }

    export class ValidateRequestError extends Result<UseCaseError> {
        public constructor(message: any) {
            super(false, {
                message: message,
            } as UseCaseError);
        }
    }

    export class UnexpectedEcoError extends Result<UseCaseError> {
        public constructor({ status, code, message, isSuccess }) {
            super(false, {
                status: status,
                code: code,
                message: message,
                isSuccess: isSuccess,
            } as UseCaseError);
        }
    }
}

export class EarnPointError {
    private statusCode: number;
    private cardNumber: string;
    private errorMessage: string;
    private earnPoint: boolean;
    private errorCode: string;
    private apiStatus: number;
    public constructor(statusCode: number, errorCode: string, earnPoint: boolean = false, errorMessage: string, cardNumber: string, apiStatus?: number) {
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.cardNumber = cardNumber;
        this.errorMessage = errorMessage;
        this.earnPoint = earnPoint;
        this.apiStatus = apiStatus || null;
    }
}
