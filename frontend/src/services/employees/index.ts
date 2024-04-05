import { APIResponse, axios } from "../../lib/axios";
import { Employee } from "../../types/employee";

export const fetchEmployee = async (): Promise<Employee[]> => {
  return (await axios.get<APIResponse<Employee[]>>("/employee")).data.data;
};

export const fetchEmployeeSearch = async (
  searchInput: string
): Promise<Employee[]> => {
  return (
    await axios.get<APIResponse<Employee[]>>(`/employee/search/${searchInput}`)
  ).data.data;
};
