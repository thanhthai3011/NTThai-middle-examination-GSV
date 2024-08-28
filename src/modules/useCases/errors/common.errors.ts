import { Result } from "../../../core/logic/Result";
import { UseCaseError } from "../../../core/logic/UseCaseError";

export namespace CommonErrors {
    export class FieldIdNotFound extends Result<UseCaseError> {
        constructor(field: string) {
            super(false, {
                message: `${field} not found`,
            } as UseCaseError);
        }
    }

    export class FieldIsRequired extends Result<UseCaseError> {
        constructor(field: string) {
            super(false, {
                message: `${field} is required`,
            } as UseCaseError);
        }
    }

    export class FieldMustToBeAString extends Result<UseCaseError> {
        constructor(field: string) {
            super(false, {
                message: `${field} must to be a string`,
            } as UseCaseError);
        }
    }

    export class FieldMustBeAtLeastNumberCharsLong extends Result<UseCaseError> {
        constructor(field: string, number: number) {
            super(false, {
                message: `${field} must be at least ${number} chars long`,
            } as UseCaseError);
        }
    }

    export class FieldCanOnlyLessThanNumberCharacters extends Result<UseCaseError> {
        constructor(field: string, number: number) {
            super(false, {
                message: `${field} can only less than ${number + 1} characters`,
            } as UseCaseError);
        }
    }

    export class FieldJustAcceptNonNegativeIntegerValues extends Result<UseCaseError> {
        constructor(field: string = "Id") {
            super(false, {
                message: `${field} just accept non-negative integer values`,
            } as UseCaseError);
        }
    }

    export class FieldCanOnlyLessThanNumberNumbers extends Result<UseCaseError> {
        constructor(field: string, number: number) {
            super(false, {
                message: `${field} can only less than ${number + 1} numbers`,
            } as UseCaseError);
        }
    }
}
