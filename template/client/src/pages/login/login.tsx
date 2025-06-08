import { Card, Flex } from 'antd';
import './login.scss';
import { LoginForm } from './loginForm/loginForm';
import { useUserContext } from '../../context/user';
import { LandingPrompt } from './landingPrompt/landingPrompt';

export interface LoginProps {

}

export function Login(props: LoginProps) {
  const user = useUserContext();
  return (
    <Flex className='login-page-root'>
      <Card>
        <LandingPrompt />
        <LoginForm
          onCreate={async (form) => {
            await user.create(form.username, form.password);
          }}
          onLogin={async (form) => {
            await user.login(form.username, form.password);
          }} />
      </Card>
    </Flex>
  )
}