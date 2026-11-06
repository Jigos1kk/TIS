export interface AppRes<ResStatus, ResData> {
    success: boolean,
    status: ResStatus,
    message?: string,
    data?: ResData,
    errors?: Record<string, string[]> | [];
}

export interface ServiceResult<ResStatus, ResData> {
    status: ResStatus,
    data?: ResData,
    errors?: Record<string, string[]> | [];
}