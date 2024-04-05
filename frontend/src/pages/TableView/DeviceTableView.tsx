import Table from "react-bootstrap/Table";
import { Device } from "types/device";

export interface DeviceTableViewProps {
  devices: Device[];
}

export const DeviceTableView = ({ devices }: DeviceTableViewProps) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Typ</th>
          <th>Marke</th>
          <th>Model</th>
          <th>Seriennummer</th>
          <th>Anzahl</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((device) => (
          <tr key={device.id}>
            <td>{device.typ}</td>
            <td>{device.brand}</td>
            <td>{device.model}</td>
            <td>{device.serialNumber}</td>
            <td>{device.amount}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
