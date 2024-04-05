import Row from "react-bootstrap/Row";
import { Employee } from "types/employee";
import { TableViewListItem } from "./TableViewListItem";

export interface TableViewListProps {
  employee: Employee[];
}

export const TableViewList = ({ employee }: TableViewListProps) => {
  return (
    <Row>
      {employee.map((e) => (
        <TableViewListItem employee={e} key={e.id} />
      ))}
    </Row>
  );
};
