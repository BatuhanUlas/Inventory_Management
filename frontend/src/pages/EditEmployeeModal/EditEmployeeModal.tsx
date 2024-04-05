import Container from "react-bootstrap/Container";
import { Employee } from "types/employee";
import { EditEmployeeModalList } from "components/Modals/EditEmployee";

export interface EditEmployeeModalProps {
  show: boolean;
  onHide: () => void;
  employee: Employee;
}

export const EditEmployeeModal = ({
  show,
  onHide,
  employee,
}: EditEmployeeModalProps) => {
  return (
    <Container>
      <EditEmployeeModalList show={show} onHide={onHide} employee={employee} />
    </Container>
  );
};
