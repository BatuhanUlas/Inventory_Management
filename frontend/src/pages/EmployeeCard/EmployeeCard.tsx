import Container from "react-bootstrap/Card";
import { EmployeeCardList } from "components/Modals/Employee";
import { Employee } from "types/employee";

export interface EmployeeCardProps {
  employee: Employee[];
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  return (
    <Container>
      <EmployeeCardList employeeCard={employee} />
    </Container>
  );
};
