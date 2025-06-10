import './App.scss';
import { useUserContext } from './context/user';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Pages } from '../../shared/routes/pages';
import { Settings } from './pages/settings/settings';
import { Route, Routes } from 'react-router';
import { AuthPage } from './pages/authPage';

export function App() {
  const user = useUserContext();
  console.log(`user: ${JSON.stringify(user.user)}`);
  
  return (
    <Routes>
      <Route path='/' element={(<Login />)} />
      <Route path={Pages.login} element={(<Login />)} />
      <Route element={(<AuthPage />)}>
        <Route path={Pages.dashboard} element={(<Dashboard />)} />
        <Route path={Pages.settings} element={(<Settings />)} />
      </Route>
    </Routes>
  );
}
