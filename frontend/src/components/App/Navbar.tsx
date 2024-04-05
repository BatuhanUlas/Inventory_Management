import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import { useAuth } from "components/Auth";

import logo from "assets/img/placeholder_logo.jpg";
import { Logout } from "pages/Logout";

export function AppNavbar() {
  const { token } = useAuth();
  return (
    <Navbar fixed="top" expand="md" className="navbar-style">
      <Container>
        <Navbar.Brand>
          <Image
            src={logo}
            alt="logo"
            style={{ height: "70px", width: "110px", objectFit: "contain" }}
          />
        </Navbar.Brand>
        <Navbar.Brand>{token ? <Logout /> : <></>}</Navbar.Brand>
      </Container>
    </Navbar>
  );
}
