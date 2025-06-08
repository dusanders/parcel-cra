import { ConfigProvider, theme } from "antd";
import { HslColorImpl } from "./colors";
import { useThemeContext } from "./theme";

export interface ThemeOverridesProps {
  children?: any;
}

export function ThemeOverrides(props: ThemeOverridesProps) {
  const themeContext = useThemeContext();
  const { token } = theme.useToken();
  const headerFooterBg = themeContext.isDarkTheme()
    ? new HslColorImpl(themeContext.current)
      .adjustHue(15)
      .adjustLumen(0.5)
      .adjustSaturation(0.6)
      .toHex()
    : new HslColorImpl(themeContext.current)
      .adjustHue(-25)
      .adjustLumen(1.4)
      .adjustSaturation(0.7)
      .toHex();

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            algorithm: themeContext.isDarkTheme() ? theme.darkAlgorithm : theme.darkAlgorithm,
            darkItemBg: token.colorBgContainer,
            darkItemColor: token.colorText,
            darkItemHoverBg: token.colorPrimaryHover
          },
          Layout: {
            headerBg: headerFooterBg,
            bodyBg: token.colorBgLayout,
            footerBg: headerFooterBg,
            siderBg: token.colorBgContainer
          }
        }
      }}>
      {props.children}
    </ConfigProvider>
  )
}