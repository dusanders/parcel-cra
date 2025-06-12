import './App.scss';
import { useUserContext } from './context/user';
import { Dashboard } from './pages/fragments/dashboard/dashboard';
import { Pages } from '../../shared/routes/pages';
import { Settings } from './pages/fragments/settings/settings';
import { Route, Routes } from 'react-router';
import { AuthLayout } from './pages/layouts/authLayout';
import { Login } from './pages/fragments/login/login';
import { NoAuthLayout } from './pages/layouts/noAuthLayout';

export function App() {
  const user = useUserContext();
  console.log(`user: ${JSON.stringify(user.user)}`);

  return (
    <Routes>
      <Route path='/' element={(<NoAuthLayout />)}>
        <Route element={(<Login />)} index />
        <Route path={Pages.login} element={(<Login />)} />
      </Route>
      <Route element={(<AuthLayout />)}>
        <Route path={Pages.dashboard} element={(<Dashboard />)} />
        <Route path={Pages.settings} element={(<Settings />)} />
      </Route>
    </Routes>
  );
}
