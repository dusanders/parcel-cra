import { Layout } from 'antd';
import './App.scss';
import { useUserContext } from './context/user';
import { Header } from './components/header/header';
import { LandingPrompt } from './components/landingPrompt/landingPrompt';
import { Login } from './pages/login/login';

export function App() {
  const user = useUserContext();
  console.log(`user: ${JSON.stringify(user.user)}`);

  return (
    <Layout className='main-layout'>
      <Header />
      <Layout.Content className='main-content'>
        <LandingPrompt />
        <Login />
      </Layout.Content>
    </Layout>
  );
}
