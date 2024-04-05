import { Employee } from "types/employee";
import { TableViewList } from "components/Cards/TableView";

export interface TableViewProps {
  employee: Employee[];
}

export const TableView = ({ employee }: TableViewProps) => {
  return <TableViewList employee={employee} />;
};
