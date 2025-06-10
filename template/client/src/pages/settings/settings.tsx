import { Card, Typography } from "antd";

export interface SettingsProps {

}

export function Settings(props: SettingsProps) {
  return (
    <Card>
      <Typography.Title>
        Settings
      </Typography.Title>
    </Card>
  )
}