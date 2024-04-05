import { Device } from "types/device";
import Card from "react-bootstrap/Card";
import { APIResponse, axios } from "lib/axios";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";

export interface CreateDeviceModalListItemProps {
  values: Device;
  onUpdate: (device: Device) => void;
}

export const CreateDeviceModalListItem = ({
  values,
  onUpdate,
}: CreateDeviceModalListItemProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const onUpdateField = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const nextFormState = {
      ...values,
      [event.target.name]: event.target.value,
    };
    onUpdate(nextFormState);
  };

  const deleteDeviceById = async () => {
    try {
      const response = await axios.delete<APIResponse>(`/device/${values.id}`);
      toast.success(response.data.message);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : (err as string);
      console.log(errorMessage);
      toast.error(err.response.data.message);
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="p-3 mb-1">
      <Form onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <strong>Typ</strong>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Typ"
            name="typ"
            value={values.typ}
            onChange={onUpdateField}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <strong>Marke</strong>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Marke"
            name="brand"
            value={values.brand}
            onChange={onUpdateField}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <strong>Modell</strong>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Modell"
            name="model"
            value={values.model}
            onChange={onUpdateField}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <strong>SerienNr.</strong>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Seriennummer"
            name="serialNumber"
            value={values.serialNumber}
            onChange={onUpdateField}
          />
        </InputGroup>
        <InputGroup className="">
          <InputGroup.Text>
            <strong>Anzahl</strong>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Anzahl"
            name="amount"
            value={values.amount}
            onChange={onUpdateField}
          />
        </InputGroup>
        <Row
          className="align-items-end align-content-end justify-content-end justify-items-end"
          style={{ display: "flex" }}
        >
          <Button
            variant="danger"
            onClick={deleteDeviceById}
            className="mb-3 mt-1 "
            style={{ width: "40px", marginRight: "15px" }}
          >
            X
          </Button>
        </Row>
      </Form>
    </Card>
  );
};
