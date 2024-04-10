import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { axios, APIResponse } from "lib/axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export interface ResetPasswordModalProps {
  show: boolean;
  onHide: () => void;
}

export const ResetPasswordModal = ({
  show,
  onHide,
}: ResetPasswordModalProps) => {
  const [resetData, setResetData] = useState({
    email: "",
    employeeNumber: "",
    newPassword: "",
  });
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const response = await axios.put<APIResponse>(
        `/employee/reset-password`,
        resetData
      );
      toast.success(response.data.message);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : (err as string);
      console.log(err);
      toast.error(err.response.data.message);
      toast.error(errorMessage);
    }
  };

  const onFieldUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFormState = {
      ...resetData,
      [event.target.name]: event.target.value,
    };
    setResetData(nextFormState);
  };
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header>
          <Modal.Title>{t("reset.password.reset")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md="12">
              <InputGroup className="mb-3">
                <InputGroup.Text id="edit-employee-name">
                  <strong>E-Mail</strong>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="E-Mail"
                  aria-label="email"
                  name="email"
                  onChange={onFieldUpdate}
                  value={resetData.email}
                />
              </InputGroup>
            </Col>
            <Col md="12">
              <InputGroup className="mb-3">
                <InputGroup.Text id="reset-employee-employeeNumber">
                  <strong>{t("employee.number")}</strong>
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="PersonalNr."
                  aria-label="personalnumber"
                  name="employeeNumber"
                  onChange={onFieldUpdate}
                  value={resetData.employeeNumber}
                />
              </InputGroup>
            </Col>
            <Col md="12">
              <InputGroup className="mb-3">
                <InputGroup.Text id="reset-employee-employeeNumber">
                  <strong>{t("reset.password")}</strong>
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder={t("login.example.password")}
                  aria-label="password"
                  name="newPassword"
                  onChange={onFieldUpdate}
                  value={resetData.newPassword}
                />
              </InputGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>
            {t("close")}
          </Button>
          <Button type="submit" variant="primary">
            {t("save")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
