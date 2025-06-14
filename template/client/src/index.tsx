import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App';
import { UserContext } from './context/user';
import { ThemeContext } from './context/theme/theme';
import { App as AntApp } from 'antd';

// TODO - this import is only until ANT supports react 19+
import '@ant-design/v5-patch-for-react-19';
import { BrowserRouter } from 'react-router';
import { InteropContext } from './context/interop';

let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    <AntApp
      className='ant-app'
      message={{
        rtl: false,
        duration: 1.2
      }}>
      <ThemeContext>
        <BrowserRouter>
          <UserContext>
            <InteropContext>
              <App />
            </InteropContext>
          </UserContext>
        </BrowserRouter>
      </ThemeContext>
    </AntApp>
  </StrictMode>
);
