import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { APIResponse, axios } from "lib/axios";
import { Employee } from "types/employee";
import { CreateDeviceModalList } from "components/Modals/CreateDeviceModal";
import { Device } from "types/device";

export interface EditEmployeeModalListItemProps {
  show: boolean;
  onHide: () => void;
  employee: Employee;
}

export const EditEmployeeModalListItem = ({
  show,
  onHide,
  employee,
}: EditEmployeeModalListItemProps) => {
  const [employeeData, setEmployeeData] = useState<Employee>(employee);
  const defaultDeviceValues: Device = {
    id: -1,
    amount: "",
    brand: "",
    model: "",
    typ: "",
    serialNumber: "",
    employee_id: employeeData.id,
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await axios.put<APIResponse>(
        `/employee/${employee.id}`,
        employeeData
      );
      toast.success(response.data.message);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : (err as string);
      console.log(err);
      toast.error(err.response.data.message);
      toast.error(errorMessage);
    }
    console.log(employeeData);

    if (employee.devices.length > 0) {
      try {
        for (const device of employee.devices) {
          axios.put<APIResponse>(`/device/${device.id}`, device);
        }
        toast.success("Gerätedaten erfolgreich aktualisiert!");
      } catch (err: any) {
        const errorMessage =
          err instanceof Error ? err.message : (err as string);
        console.log(err);
        toast.error(err.response.data.message);
        toast.error(errorMessage);
      }
    } else {
      try {
        for (const device of employee.devices) {
          axios.post<APIResponse>(`/device/`, device);
        }
      } catch (err: any) {
        const errorMessage =
          err instanceof Error ? err.message : (err as string);
        console.log(err);
        toast.error(err.response.data.message);
        toast.error(errorMessage);
      }
    }
  };

  const onUpdateField = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    index: number
  ) => {
    console.log("onUpdateField");
    let nextFormState;
    if (index === -1) {
      // Updating employee data, not device data
      nextFormState = {
        ...employeeData,
        [event.target.name]: event.target.value,
      };
    } else {
      // Updating device data
      nextFormState = {
        ...employeeData,
        devices: [...employeeData.devices], // Copying the devices array
      };

      nextFormState.devices[index] = {
        ...nextFormState.devices[index],
        [event.target.name]: event.target.value,
      };
    }

    setEmployeeData(nextFormState);
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

  return (
    <Modal
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title>
            {employee.salutation} {employee.lastname} {employee.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md="4">
              <InputGroup className="mb-3">
                <InputGroup.Text id="edit-employee-name">
                  <strong>E-Mail</strong>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={employee.email}
                  aria-label="email"
                  aria-describedby="editEmployeeEmail"
                  name="email"
                  onChange={(event) => onUpdateField(event, -1)}
                  value={employeeData.email}
                />
              </InputGroup>
            </Col>
            <Col md="4">
              <InputGroup className="mb-3">
                <InputGroup.Text id="edit-employee-salutation">
                  <strong>Anrede</strong>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={employee.salutation}
                  aria-label="salutation"
                  name="salutation"
                  onChange={(event) => onUpdateField(event, -1)}
                  value={employeeData.salutation}
                />
              </InputGroup>
            </Col>
            <Col md="4">
              <InputGroup className="mb-3">
                <InputGroup.Text id="edit-employee-lastname">
                  <strong>Nachname</strong>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={employee.lastname}
                  aria-label="lastname"
                  name="lastname"
                  onChange={(event) => onUpdateField(event, -1)}
                  value={employeeData.lastname}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <InputGroup className="mb-3">
                <InputGroup.Text id="edit-employee-name">
                  <strong>Name</strong>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={employee.name}
                  aria-label="name"
                  name="name"
                  onChange={(event) => onUpdateField(event, -1)}
                  value={employeeData.name}
                />
              </InputGroup>
            </Col>
            <Col md="4">
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <strong>PersonalNr.</strong>
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="employeenumber"
                  aria-label="personalnumber"
                  name="employeeNumber"
                  onChange={(event) => onUpdateField(event, -1)}
                  value={employeeData.employeeNumber}
                />
              </InputGroup>
            </Col>
            <Col md="4">
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <strong>Rechte</strong>
                </InputGroup.Text>
                <Form.Select
                  id="right_id"
                  name="right_id"
                  onChange={(event) => onUpdateField(event, -1)}
                  value={employeeData.right_id}
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Normal</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
          <hr />
          <Row>
            <CreateDeviceModalList
              devices={employeeData.devices}
              onUpdate={updateDeviceByIndex}
            />
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
            {/* {employee.devices.map((ed, index) => (
              <Col md="3" key={index}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <strong>Typ</strong>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={ed.typ}
                    name="typ"
                    onChange={(event) => onUpdateField(event, index)}
                    value={ed.typ}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <strong>Marke</strong>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={ed.brand}
                    name="brand"
                    onChange={(event) => onUpdateField(event, index)}
                    value={ed.brand}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <strong>Modell</strong>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={ed.model}
                    name="model"
                    onChange={(event) => onUpdateField(event, index)}
                    value={ed.model}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <strong>SerienNr.</strong>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={ed.serialNumber}
                    name="serialNumber"
                    onChange={(event) => onUpdateField(event, index)}
                    value={ed.serialNumber}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <strong>Anzahl</strong>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={ed.amount}
                    name="amount"
                    onChange={(event) => onUpdateField(event, index)}
                    value={ed.amount}
                  />
                </InputGroup>
              </Col>
            ))} */}
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
