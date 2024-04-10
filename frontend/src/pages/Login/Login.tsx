import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";

import lockIcon from "assets/icons/lock-solid.svg";
import { axios, APIResponse } from "lib/axios";
import { useAuth } from "components/Auth";
import { useNavigate } from "react-router";
import { ResetPasswordModal } from "../ResetPasswordModal";
import { useTranslation } from "react-i18next";

interface FormProps {
  email: string;
  password: string;
}

export function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showresetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [form, setForm] = useState<FormProps>({
    email: "",
    password: "",
  });

  const handleResetPasswordClick = () => {
    setShowResetPasswordModal(true);
  };

  const handleCloseResetPasswordModal = () => {
    setShowResetPasswordModal(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      const formData = { ...form, email: form.email + "@company-mail.de" };

      const response = await axios.post<APIResponse>(
        "/employee/login",
        formData
      );

      //@ts-ignore
      setToken(`Bearer ${response.data.data.token}`);
      navigate("/", { replace: true });

      toast.success("Anmeldung erfolgreich");

      setForm({
        email: "",
        password: "",
      });
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : (err as string);
      console.log(err);
      toast.error(err.response.data.message);
      toast.error(errorMessage);
    }
  };

  const onUpdateField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFormState = {
      ...form,
      [event.target.name]: event.target.value,
    };
    setForm(nextFormState);
  };

  const fieldEmpty = useMemo(() => {
    return !(form.email !== "" && form.password !== "");
  }, [form]);

  return (
    <main>
      <Container>
        <Form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card className="mt-5" style={{ width: "50%" }}>
            <Card.Header>
              {" "}
              <h2>{t("login")}</h2>
            </Card.Header>
            <Card.Body>
              <Row>
                <InputGroup className="mb-3">
                  <Form.Control
                    required
                    type="text"
                    placeholder={t("login.example.name")}
                    aria-label="mustermann"
                    aria-describedby="login-email"
                    onChange={onUpdateField}
                    name="email"
                    value={form.email}
                  />

                  <InputGroup.Text id="login-email">
                    <strong>@company-mail.de</strong>
                  </InputGroup.Text>
                </InputGroup>
              </Row>
              <Row>
                <InputGroup className="mb-1">
                  <Form.Control
                    required
                    type="password"
                    placeholder={t("login.example.password")}
                    aria-label="password"
                    aria-describedby="login-password"
                    onChange={onUpdateField}
                    name="password"
                    value={form.password}
                  />

                  <InputGroup.Text id="login-password">
                    <Image
                      src={lockIcon}
                      style={{
                        height: "25px",
                        width: "25px",
                        objectFit: "contain",
                      }}
                    />
                  </InputGroup.Text>
                </InputGroup>
                <strong
                  color="blue"
                  className="reset-password"
                  onClick={handleResetPasswordClick}
                >
                  {t("login.forgott.password")}
                </strong>
              </Row>
              <Button type="submit" variant="primary" disabled={fieldEmpty}>
                {t("login.login")}
              </Button>
            </Card.Body>
          </Card>
        </Form>
        <ResetPasswordModal
          show={showresetPasswordModal}
          onHide={handleCloseResetPasswordModal}
        />
      </Container>
    </main>
  );
}
