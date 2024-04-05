import { Employee } from "types/employee";
import { EmployeeCardListItem } from "./EmployeeCardListItem";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export interface EmployeeCardListProps {
  employeeCard: Employee[];
}

export const EmployeeCardList = ({ employeeCard }: EmployeeCardListProps) => {
  return (
    <Row>
      {employeeCard.map((e) => (
        <Col xl="4" md="6" sm="12" xs="12" key={e.id} className="mt-4">
          <EmployeeCardListItem employeeCard={e} />
        </Col>
      ))}
    </Row>
  );
};
