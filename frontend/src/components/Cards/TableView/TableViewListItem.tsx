import Table from "react-bootstrap/Table";
import { Employee } from "types/employee";
import { useState } from "react";
import { EditEmployeeModal } from "pages/EditEmployeeModal/EditEmployeeModal";
import { DeviceTableView } from "pages/TableView";

export interface TableViewListItemProps {
  employee: Employee;
}

export const TableViewListItem = ({ employee }: TableViewListItemProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleRowClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <Table
        striped
        bordered
        hover
        responsive="xl"
        onClick={handleRowClick}
        className="mouse-hover"
      >
        <thead>
          <tr>
            <th className="table-header-color">ID</th>
            <th className="table-header-color">Name</th>
            <th className="table-header-color">Nachname</th>
            <th className="table-header-color">Anrede</th>
            <th className="table-header-color">Email</th>
            <th className="table-header-color">PersonalNr.</th>
            <th className="table-header-color">Rechte</th>
            <th className="table-header-color">Geräte</th>
          </tr>
        </thead>
        <tbody>
          <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.lastname}</td>
            <td>{employee.salutation}</td>
            <td>{employee.email}</td>
            <td>{employee.employeeNumber}</td>
            <td>{employee.right_id === 1 ? "Admin" : "Normal"}</td>
            <DeviceTableView devices={employee.devices} />
          </tr>
        </tbody>
      </Table>
      <hr />
      <EditEmployeeModal
        show={showModal}
        onHide={handleCloseModal}
        employee={employee}
      />
    </>
  );
};
