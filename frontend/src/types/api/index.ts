export interface ApiResponse<T> {
    status: "success" | "error",
    message: string;
    
}