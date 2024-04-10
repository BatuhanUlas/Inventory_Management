import { useAuth } from "components/Auth";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

export const Logout = () => {
  const { setToken } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    //@ts-ignore
    setToken();
  };

  return <Button onClick={handleLogout}>{t("logout")}</Button>;
};
