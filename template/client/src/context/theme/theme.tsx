import { ConfigProvider, theme } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeOverrides } from "./overrides";
import useApp from "antd/es/app/useApp";

export interface IThemeContext {
  current: string;
  setNewSeed(color: string): void;
  isDarkTheme(): boolean;
  toggleDarkTheme(): void;
}

export const ThemeContext_React = createContext({} as IThemeContext);

export interface ThemeContextProps {
  children?: any;
}

export function ThemeContext(props: ThemeContextProps) {
  const defaultTheme = '#2d8dab'
  const [current, setCurrent] = useState<string>(defaultTheme);
  const [themeChanged, setThemeChanged] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const antApp = useApp();

  useEffect(() => {
    if (themeChanged) {
      antApp.message.info({
        content: (
          <p>Theme updated with {current}</p>
        )
      });
      setThemeChanged(false)
    }
  }, [themeChanged]);
  useEffect(() => {
    setThemeChanged(current !== defaultTheme);
  }, [current]);

  return (
    <ThemeContext_React.Provider value={{
      current: current,
      setNewSeed: (seed) => {
        setCurrent(seed);
      },
      isDarkTheme: () => isDarkTheme,
      toggleDarkTheme: () => { setIsDarkTheme(!isDarkTheme) }
    }}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: current
          },
          algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}>
        <ThemeOverrides>
          {props.children}
        </ThemeOverrides>
      </ConfigProvider>
    </ThemeContext_React.Provider>
  )
}

export function useThemeContext() {
  return useContext(ThemeContext_React);
}