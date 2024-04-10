import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { APIResponse, axios } from "lib/axios";
import { AxiosResponse } from "axios";
import { Employee } from "types/employee";
import { CreateDeviceModalList } from "../CreateDeviceModal";
import { Device } from "types/device";
import { useTranslation } from "react-i18next";

export interface CreateEmployeeModalListItemProps {
  show: boolean;
  onHide: () => void;
}

export const CreateEmployeeModalListItem = ({
  show,
  onHide,
}: CreateEmployeeModalListItemProps) => {
  const { t } = useTranslation();
  const defaultDeviceValues: Device = {
    amount: "",
    brand: "",
    model: "",
    typ: "",
    serialNumber: "",
    employee_id: 0,
  };

  const [employeeData, setEmployeeData] = useState<Employee>({
    id: -1,
    email: "",
    name: "",
    lastname: "",
    salutation: "",
    right_id: 1,
    devices: [],
    employeeNumber: 0,
    password: "",
  });

  const addNewDevice = () => {
    const newDevice = { ...defaultDeviceValues };

    setEmployeeData((prevEmployeeData) => ({
      ...prevEmployeeData,
      devices: [...prevEmployeeData.devices, newDevice],
    }));
  };

  const removeLastDevice = () => {
    setEmployeeData((prevEmployeeData) => {
      const newDevices = prevEmployeeData.devices.slice(
        0,
        prevEmployeeData.devices.length - 1
      );
      return {
        ...prevEmployeeData,
        devices: newDevices,
      };
    });
  };

  const updateDeviceByIndex = (index: number, updatedValues: Device) => {
    setEmployeeData((prevEmployeeData) => {
      const newDevices = [...prevEmployeeData.devices];
      newDevices[index] = updatedValues;
      return {
        ...prevEmployeeData,
        devices: newDevices,
      };
    });
  };

  const handleDeviceFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(event);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const employee = await postUserData(employeeData);
      const devices = await postDevices(employee.id, employeeData.devices);
      console.log(devices);
      toast.success("Erfolgreich hinzugefügt!");
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : (err as string);
      console.log(err);
      toast.error(err.response.data.message);
      toast.error(errorMessage);
    }
  };

  const postDevices = async (
    employeeId: number,
    devices: Device[]
  ): Promise<Device[]> => {
    const promises: Promise<AxiosResponse<APIResponse<Device>>>[] = [];

    if (devices.length !== 0) {
      for (let i = 0; i < devices.length; i++) {
        const device = devices[i];

        const promise = axios.post<APIResponse<Device>>(
          `/employee/${employeeId}/devices`,
          device
        );
        promises.push(promise);
      }
    }

    const response = await Promise.all(promises);
    return response.map((resp) => resp.data.data);
  };

  const postUserData = async (employee: Employee): Promise<Employee> => {
    return (await axios.post<APIResponse<Employee>>("/employee", employee)).data
      .data;
  };

  const onUpdateField = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const nextFormState = {
      ...employeeData,
      [event.target.name]: event.target.value,
    };

    setEmployeeData(nextFormState);
  };

  return (
    <Modal
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form onSubmit={handleDeviceFormSubmit}>
        <Modal.Header>
          <Modal.Title>{t("createEmployee.add")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md="3">
              <InputGroup className="mb-3">
                <InputGroup.Text id="edit-employee-email">
                  <strong>{t("tableview.email")}</strong>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={t("tableview.email")}
                  aria-label="email"
                  aria-describedby="editEmployeeEmail"
                  name="email"
                  onChange={onUpdateField}
                  value={employeeData.email}
                />
              </InputGroup>
            </Col>
            <Col md="3">
              <InputGroup className="mb-3">
                <InputGroup.Text id="edit-employee-salutation">
                  <strong>{t("tableview.salutation")}</strong>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Herr/Frau/Divers"
                  aria-label="salutation"
                  name="salutation"
                  onChange={onUpdateField}
                  value={employeeData.salutation}
                />
              </InputGroup>
            </Col>
            <Col md="3">
              <InputGroup className="mb-3">
                <InputGroup.Text id="edit-employee-lastname">
                  <strong>{t("tableview.lastname")}</strong>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={t("tableview.lastname")}
                  aria-label="lastname"
                  name="lastname"
                  onChange={onUpdateField}
                  value={employeeData.lastname}
                />
              </InputGroup>
            </Col>
            <Col md="3">
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <strong>{t("tableview.right")}</strong>
                </InputGroup.Text>
                <Form.Select
                  id="right_id"
                  name="right_id"
                  onChange={onUpdateField}
                  value={employeeData.right_id}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Normal</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col md="3">
              <InputGroup className="mb-3">
                <InputGroup.Text id="edit-employee-name">
                  <strong>{t("tableview.name")}</strong>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={t("tableview.name")}
                  aria-label="name"
                  name="name"
                  onChange={onUpdateField}
                  value={employeeData.name}
                />
              </InputGroup>
            </Col>
            <Col md="3">
              <InputGroup className="mb-3">
                <InputGroup.Text id="edit-employee-password">
                  <strong>{t("login.example.password")}</strong>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={t("login.example.password")}
                  aria-label="name"
                  name="password"
                  onChange={onUpdateField}
                  value={employeeData.password}
                />
              </InputGroup>
            </Col>
            <Col md="3">
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <strong>{t("tableview.personalnumber")}</strong>
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder={t("tableview.personalnumber")}
                  aria-label="personalnumber"
                  name="employeeNumber"
                  onChange={onUpdateField}
                  value={employeeData.employeeNumber}
                />
              </InputGroup>
            </Col>
          </Row>
          <hr />
          <Row>
            <CreateDeviceModalList
              devices={employeeData.devices}
              onUpdate={updateDeviceByIndex}
            />
          </Row>
          <Row>
            <Col md="6">
              <Button
                className="m-2"
                variant="danger"
                onClick={removeLastDevice}
              >
                -
              </Button>
              <Button className="m-2" onClick={addNewDevice}>
                +
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide} variant="danger">
            Schließen
          </Button>
          <Button type="submit" variant="primary">
            Speichern
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
