import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import { Device } from "types/device";

export interface DeviceTableViewProps {
  devices: Device[];
}

export const DeviceTableView = ({ devices }: DeviceTableViewProps) => {
  const { t } = useTranslation();
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>{t("devicetable.typ")}</th>
          <th> {t("devicetable.brand")}</th>
          <th> {t("devicetable.model")}</th>
          <th> {t("devicetable.serialnumber")}</th>
          <th> {t("devicetable.amount")}</th>
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
