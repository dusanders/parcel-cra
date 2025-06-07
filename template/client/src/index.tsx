import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App';
import { UserContext } from './context/user';

let container = document.getElementById("app")!;
let root = createRoot(container)
root.render(
  <StrictMode>
    <UserContext>
      <App />
    </UserContext>
  </StrictMode>
);
