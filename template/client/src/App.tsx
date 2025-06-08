import { Card, Layout } from 'antd';
import './App.scss';
import { useUserContext } from './context/user';
import { Header } from './components/header/header';
import { Login } from './pages/login/login';
import { Footer } from './components/footer/footer';
import { Dashboard } from './pages/dashboard/dashboard';

export function App() {
  const user = useUserContext();
  console.log(`user: ${JSON.stringify(user.user)}`);

  return (
    <>
      {!user.user && (
        <Login />
      )}
      {user.user && user.user.hasAuth && (
        <Dashboard />
      )}
    </>
  );
}
