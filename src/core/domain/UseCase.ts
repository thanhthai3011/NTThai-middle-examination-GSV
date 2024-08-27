export interface UseCase<IRequest, IResponse> {
    execute(request?: IRequest, response?: IResponse): Promise<IResponse> | IResponse;
}
