import Container from "react-bootstrap/Container";
import { CreateEmployeeModalList } from "components/Modals/CreateEmployee/CreateEmployeeModalList";

export interface CreateEmployeeModalProps {
  show: boolean;
  onHide: () => void;
}

export const CreateEmployeeModal = ({
  show,
  onHide,
}: CreateEmployeeModalProps) => {
  return (
    <Container>
      <CreateEmployeeModalList show={show} onHide={onHide} />
    </Container>
  );
};
