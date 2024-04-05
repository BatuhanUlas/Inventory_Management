import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Employee } from "types/employee";
import Table from "react-bootstrap/Table";

import placeholder from "assets/img/placeholder.png";
import { useState } from "react";
import { EditEmployeeModal } from "pages/EditEmployeeModal";

export interface EmployeeCardListItemProps {
  employeeCard: Employee;
}

export const EmployeeCardListItem = ({
  employeeCard,
}: EmployeeCardListItemProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleRowClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <Card
        onClick={handleRowClick}
        className="mouse-hover"
        style={{ minHeight: "450px" }}
      >
        <Row>
          <Card.Img
            variant="top"
            height={150}
            className="contain"
            src={
              employeeCard.image === undefined
                ? placeholder
                : employeeCard.image.src
            }
          />
        </Row>
        <Card.Body>
          <Row>
            <Col md="12">
              <Card.Title className="card-title">
                {employeeCard.salutation} {employeeCard.lastname},{" "}
                {employeeCard.name}
              </Card.Title>
            </Col>
          </Row>
          <Row>
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>PersonalNr.</td>
                  <td>{employeeCard.employeeNumber}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{employeeCard.email}</td>
                </tr>
                <tr>
                  <td>Berechtigung</td>
                  <td>{employeeCard.right_id === 1 ? "Admin" : "Normal"}</td>
                </tr>
                <tr>
                  <td>Anzahl Geräte</td>
                  <td>{employeeCard.devices.length}</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Card.Body>
      </Card>
      <EditEmployeeModal
        show={showModal}
        onHide={handleCloseModal}
        employee={employeeCard}
      />
    </>
  );
};
