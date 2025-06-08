import { Card, Flex } from 'antd';
import './login.scss';
import { LoginForm } from '../../components/loginForm/loginForm';
import { useUserContext } from '../../context/user';

export interface LoginProps {

}

export function Login(props: LoginProps) {
  const user = useUserContext();
  return (
    <Flex className='login-page-root'>
      <LoginForm
        onCreate={async (form) => {
          await user.create(form.username, form.password);
        }}
        onLogin={async (form) => {
          await user.login(form.username, form.password);
        }} />
    </Flex>
  )
}