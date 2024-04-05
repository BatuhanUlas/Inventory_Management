import { useAuth } from "components/Auth";
import Button from "react-bootstrap/Button";

export const Logout = () => {
  const { setToken } = useAuth();

  const handleLogout = () => {
    //TODO FIX TYP NULL
    //@ts-ignore
    setToken();
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};
