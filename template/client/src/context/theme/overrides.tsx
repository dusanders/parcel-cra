import { ConfigProvider, theme } from "antd";

export interface ThemeOverridesProps {
  children?: any;
}

export function ThemeOverrides(props: ThemeOverridesProps) {
  const { token } = theme.useToken();
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: token.colorFillSecondary,
            bodyBg: token.colorBgLayout
          }
        }
      }}>
      {props.children}
    </ConfigProvider>
  )
}