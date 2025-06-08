import { ConfigProvider, theme } from "antd";
import { useThemeHelpers } from "./colors";
import { useThemeContext } from "./theme";

export interface ThemeOverridesProps {
  children?: any;
}

export function ThemeOverrides(props: ThemeOverridesProps) {
  const themeContext = useThemeContext();
  const colorHelper = useThemeHelpers(themeContext.isDarkTheme(), themeContext.current);
  const { token } = theme.useToken();
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: token.colorFillContentHover,
            bodyBg: token.colorBgLayout,
            footerBg: token.colorFillContentHover
          }
        }
      }}>
      {props.children}
    </ConfigProvider>
  )
}