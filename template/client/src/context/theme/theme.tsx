import { ConfigProvider, theme } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeOverrides } from "./overrides";
import useApp from "antd/es/app/useApp";

/**
 * Define the Theme context
 */
export interface IThemeContext {
  current: string;
  setNewSeed(color?: string): void;
  isDarkTheme(): boolean;
  toggleDarkTheme(): void;
}

/**
 * Create the React context. Should not be directly used - use the hooks instead.
 */
export const ThemeContext_React = createContext({} as IThemeContext);

/**
 * Define the props
 */
export interface ThemeContextProps {
  children?: any;
}

/**
 * Implement the context with a functional HoC
 * @param props 
 * @returns 
 */
export function ThemeContext(props: ThemeContextProps) {
  const defaultTheme = '#18d4a8'
  const [current, setCurrent] = useState<string>(defaultTheme);
  const [themeChanged, setThemeChanged] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const antApp = useApp();

  /**
   * Show the user a notification that the theme was changed
   */
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

  /**
   * simple state flag that the theme did change
   */
  useEffect(() => {
    setThemeChanged(current !== defaultTheme);
  }, [current]);

  return (
    // Implement the context
    <ThemeContext_React.Provider value={{
      current: current,
      setNewSeed: (seed) => {
        setCurrent(seed || defaultTheme);
      },
      isDarkTheme: () => isDarkTheme,
      toggleDarkTheme: () => { setIsDarkTheme(!isDarkTheme) }
    }}>
      {/** Configure the Ant Design framework */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: current,
          },
          algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}>
        {/** We have further overrides to do - this is because we need to allow
           * Ant Design to calculate our above seed and use those NEW calcs as bases 
           * for other components!
           */}
        <ThemeOverrides>
          {props.children}
        </ThemeOverrides>
      </ConfigProvider>
    </ThemeContext_React.Provider>
  )
}

/**
 * Convenience hook to use the Theme context contract
 * @returns 
 */
export function useThemeContext() {
  return useContext(ThemeContext_React);
}