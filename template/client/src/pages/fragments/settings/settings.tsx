import { Card, Col, ColorPicker, Row, Typography } from "antd";
import { useThemeContext } from "../../../context/theme/theme";
import './settings.scss';
import { useUserContext } from "../../../context/user";

export interface SettingsProps {

}

export function Settings(props: SettingsProps) {
  const theme = useThemeContext();
  const user = useUserContext();
  return (
    <Card className="settings-root">
      <Typography.Title>
        Settings
      </Typography.Title>
      <Row>
        <Col span={8}>
          <Card className="card theme-card"
          title="Theme Settings">
            <ColorPicker className='color-picker'
              showText
              value={theme.current}
              onChange={async (val, css) => {
                await user.update({
                  ...user.user!,
                  theme: val.toHexString()
                })
                theme.setNewSeed(val.toHexString());
              }} />
          </Card>
        </Col>
      </Row>
    </Card>
  )
}