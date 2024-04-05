export interface APIResponse<T = unknown> {
  status: "success" | "error";
  data: T;
  message: string;
}
