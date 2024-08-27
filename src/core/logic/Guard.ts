export type GuardResponse = string;

import { Result } from "./Result";

export interface IGuardArgument {
    argument: any;
    argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
    public static combine(guardResults: Result<any>[]): Result<GuardResponse> {
        for (const result of guardResults) {
            if (result.isFailure) return result;
        }

        return Result.ok<GuardResponse>();
    }

    public static greaterThan(minValue: number, actualValue: number): Result<GuardResponse> {
        return actualValue > minValue
            ? Result.ok<GuardResponse>()
            : Result.fail<GuardResponse>(`Number given {${actualValue}} is not greater than {${minValue}}`);
    }

    public static againstAtLeast(numChars: number, text: string, argumentName: string): Result<GuardResponse> {
        return text.length >= numChars ? Result.ok<GuardResponse>() : Result.fail<GuardResponse>(`${argumentName} is at least ${numChars} chars`);
    }

    public static againstAtMost(numChars: number, text: string, argumentName: string): Result<GuardResponse> {
        return text.length <= numChars ? Result.ok<GuardResponse>() : Result.fail<GuardResponse>(`${argumentName} must be at most ${numChars} characters`);
    }

    public static againstLessThan(numChars: number, text: string, argumentName: string): Result<GuardResponse> {
        return text.length <= numChars
            ? Result.ok<GuardResponse>()
            : Result.fail<GuardResponse>(`${argumentName} can only less than ${numChars + 1} characters`);
    }

    public static againstNullOrUndefined(argument: any, argumentName: string): Result<GuardResponse> {
        if (argument === null || argument === undefined || argument === "") {
            return Result.fail<GuardResponse>(`${argumentName} is required`);
        } else {
            return Result.ok<GuardResponse>();
        }
    }

    public static againstNotInListValue(listValue: any[], argument: string, messageError: string): Result<GuardResponse> {
        if (!listValue.includes(argument)) {
            return Result.fail<GuardResponse>(`${messageError}`);
        } else {
            return Result.ok<GuardResponse>();
        }
    }

    public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): Result<GuardResponse> {
        for (const arg of args) {
            const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
            if (result.isFailure) return result;
        }

        return Result.ok<GuardResponse>();
    }

    public static isEmail(email: string, argumentName: string): Result<GuardResponse> {
        const emailRegex = new RegExp(
            /^([a-zA-Z0-9_\-\\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(?!hotmail|yahoo)(([a-zA-Z0-9\\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
        );
        if (emailRegex.test(email)) return Result.ok<GuardResponse>();

        return Result.fail<GuardResponse>(`${argumentName} is not a valid`);
    }

    public static isPhoneNumber<T>(phone: any, argumentName: string): Result<GuardResponse> {
        const phoneRegex = new RegExp(/^(0)+([0-9]{9,})$\b/);
        if (phoneRegex.test(phone)) return Result.ok<GuardResponse>();

        return Result.fail<GuardResponse>(`${argumentName} is not a valid`);
    }

    public static isDate<T>(value: any, argumentName: string): Result<GuardResponse> {
        const dateRegex = new RegExp(/^([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1}))/);
        if (dateRegex.test(value)) return Result.ok<GuardResponse>();

        return Result.fail<GuardResponse>(`${argumentName ? argumentName : "requested date"} format is YYYY-MM-DD`);
    }

    public static isDateTime<T>(value: any, argumentName: string): Result<GuardResponse> {
        const dateTimeRegex = new RegExp(/^([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})) ([0-1]{1}[0-9]{1}|2[0-3]{1}):([0-5]{1}[0-9]{1}):([0-5]{1}[0-9]{1})$/);
        if (dateTimeRegex.test(value)) return Result.ok<GuardResponse>();

        return Result.fail<GuardResponse>(`The date is invalid. Please enter a date in the format yyyy-mm-dd hh:mm:ss`);
    }

    public static isOneOf(value: any, validValues: any[], argumentName: string): Result<GuardResponse> {
        let isValid = false;
        for (const validValue of validValues) {
            if (value === validValue) {
                isValid = true;
            }
        }

        if (isValid) {
            return Result.ok<GuardResponse>();
        } else {
            return Result.fail<GuardResponse>(`${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`);
        }
    }

    public static inRange(num: number, min: number, max: number, argumentName: string): Result<GuardResponse> {
        const isInRange = num >= min && num <= max;
        if (!isInRange) {
            return Result.fail<GuardResponse>(`${argumentName} is not within range ${min} to ${max}.`);
        } else {
            return Result.ok<GuardResponse>();
        }
    }

    public static allInRange(numbers: number[], min: number, max: number, argumentName: string): Result<GuardResponse> {
        let failingResult: Result<GuardResponse> = null;

        for (const num of numbers) {
            const numIsInRangeResult = this.inRange(num, min, max, argumentName);
            if (!numIsInRangeResult.isFailure) failingResult = numIsInRangeResult;
        }

        if (failingResult) {
            return Result.fail<GuardResponse>(`${argumentName} is not within the range.`);
        } else {
            return Result.ok<GuardResponse>();
        }
    }

    public static isBoolean(value: any, argumentName: string): Result<GuardResponse> {
        if (typeof value === "boolean") {
            return Result.ok<GuardResponse>();
        } else {
            return Result.fail<GuardResponse>(`Invalid input. Enter 'true' or 'false' for the ${argumentName} field`);
        }
    }

    public static isNumber(value: any, argumentName: string): Result<GuardResponse> {
        if (typeof value === "number") {
            return Result.ok<GuardResponse>();
        } else {
            return Result.fail<GuardResponse>(`Invalid input. Enter a integer for the ${argumentName} field`);
        }
    }
}
