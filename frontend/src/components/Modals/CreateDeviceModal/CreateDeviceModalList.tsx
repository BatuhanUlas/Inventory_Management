import { CreateDeviceModalListItem } from "./CreateDeviceModalListItem";
import Col from "react-bootstrap/Col";
import { Device } from "types/device";

export interface CreateDeviceModalListProps {
  devices: Device[];
  onUpdate: (index: number, device: Device) => void;
}
export const CreateDeviceModalList = ({
  devices,
  onUpdate,
}: CreateDeviceModalListProps) => {
  return (
    <>
      {devices.map((device, index) => (
        <Col xs="12" sm="12" md="6" lg="4" xl="4" key={index}>
          <CreateDeviceModalListItem
            values={device}
            onUpdate={(dev) => onUpdate(index, dev)}
          />
        </Col>
      ))}
    </>
  );
};
