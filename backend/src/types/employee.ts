import { Device } from "./device";
import { Image } from "./image";

export interface Employee {
  id: number;
  name: string;
  lastname: string;
  salutation: string;
  email: string;
  token: string;
  employeeNumber: number;
  password: string;
  image: Image;
  devices: Device[];
  right_id: number;
}
