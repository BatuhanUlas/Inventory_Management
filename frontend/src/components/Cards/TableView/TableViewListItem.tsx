import Table from "react-bootstrap/Table";
import { Employee } from "types/employee";
import { useState } from "react";
import { EditEmployeeModal } from "pages/EditEmployeeModal/EditEmployeeModal";
import { DeviceTableView } from "pages/TableView";
import { useTranslation } from "react-i18next";

export interface TableViewListItemProps {
  employee: Employee;
}

export const TableViewListItem = ({ employee }: TableViewListItemProps) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

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
            <th className="table-header-color">{t("tableview.id")}</th>
            <th className="table-header-color">{t("tableview.name")}</th>
            <th className="table-header-color">{t("tableview.lastname")}</th>
            <th className="table-header-color">{t("tableview.salutation")}</th>
            <th className="table-header-color">{t("tableview.email")}</th>
            <th className="table-header-color">
              {t("tableview.personalnumber")}
            </th>
            <th className="table-header-color">{t("tableview.right")}</th>
            <th className="table-header-color">{t("tableview.devices")}</th>
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
