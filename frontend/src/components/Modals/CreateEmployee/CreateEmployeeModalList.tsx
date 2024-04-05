import { CreateEmployeeModalListItem } from "./CreateEmployeeModalListItem";

export interface CreateEmployeeModalListProps {
  show: boolean;
  onHide: () => void;
}

export const CreateEmployeeModalList = ({
  show,
  onHide,
}: CreateEmployeeModalListProps) => {
  return <CreateEmployeeModalListItem show={show} onHide={onHide} />;
};
