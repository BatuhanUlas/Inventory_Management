import { Image } from "../image";

export interface Device {
  id?: number;
  typ: string;
  serialNumber: string;
  brand: string;
  model: string;
  amount: string;
  employee_id: number;
  image?: Image;
}
