import { Employee } from "types/employee";
import { EditEmployeeModalListItem } from "./EditEmployeeModalListItem";
export interface EditEmployeeListProps {
  show: boolean;
  onHide: () => void;
  employee: Employee;
}

export const EditEmployeeModalList = ({
  show,
  onHide,
  employee,
}: EditEmployeeListProps) => {
  return (
    <EditEmployeeModalListItem
      show={show}
      onHide={onHide}
      employee={employee}
    />
  );
};
