import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { EmployeeCard } from "pages/EmployeeCard";
import { toast } from "react-toastify";
import { Employee } from "types/employee";
import { fetchEmployee } from "services/employees";
import { TableView } from "pages/TableView";
import { CreateEmployeeModal } from "pages/CreateEmployeeCard";
import { SearchBar } from "components/App/SearchBar";
import { useTranslation } from "react-i18next";

export function Home() {
  const [employeeView, showEmployeeView] = useState<boolean>(false);
  const [enableNewButton, setEnableNewButton] = useState<number>(1);
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [showCreateEmployeeModal, setShowCreateEmployeeModal] =
    useState<boolean>(false);

  const { t } = useTranslation();

  const getEmployees = async () => {
    try {
      const employees: Employee[] = await fetchEmployee();
      setEmployee(employees);
      setEnableNewButton(employees[0].right_id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : (err as string);
      toast.error(errorMessage);
    }
  };
  const handleRowClick = () => {
    setShowCreateEmployeeModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateEmployeeModal(false);
  };

  const handleSearchResults = (searchResults: Employee[]) => {
    setSearchResults(searchResults);
    console.log("HALLO", searchResults.length);
  };

  useEffect(() => {
    getEmployees();
  }, [searchResults]);

  return (
    <main>
      <section>
        <Container>
          <Row className="align-items-center justify-content-center">
            <Col md="4">
              <h1>{t("home.employee")}</h1>
            </Col>
            <Col md="6">
              <SearchBar onSearchResults={handleSearchResults} />
            </Col>
            <Col md="1">
              <Form.Check
                type="switch"
                id="employeeView"
                onChange={() => showEmployeeView(!employeeView)}
                label={t("home.switch.label")}
              />
            </Col>
            <Col md="1">
              <Button
                onClick={handleRowClick}
                variant="primary"
                disabled={enableNewButton !== 1}
              >
                {t("new")}
              </Button>
            </Col>
          </Row>
          {employee === undefined ? (
            <Row className="mt-2">
              <h2>{t("home.employee.empty")}</h2>
            </Row>
          ) : (
            <Row className="mt-2">
              {employeeView ? (
                <TableView employee={employee} />
              ) : searchResults.length <= 0 ? (
                <EmployeeCard employee={employee} />
              ) : (
                <EmployeeCard employee={searchResults} />
              )}
            </Row>
          )}
          <CreateEmployeeModal
            show={showCreateEmployeeModal}
            onHide={handleCloseModal}
          />
        </Container>
      </section>
    </main>
  );
}
