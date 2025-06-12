import { Card, Flex } from 'antd';
import './login.scss';
import { LoginForm } from './loginForm/loginForm';
import { LandingPrompt } from './landingPrompt/landingPrompt';
import { useNavigate } from 'react-router';
import { Pages } from '../../../../../shared/routes/pages';
import { useUserContext } from '../../../context/user';

export interface LoginProps {

}

export function Login(props: LoginProps) {
  const user = useUserContext();
  const navigate = useNavigate();
  return (
    <Flex className='loginPage-root'>
      <Card className='loginPage-card'>
        <LandingPrompt />
        <LoginForm
          onCreate={async (form) => {
            if (await user.create(form.username, form.password)) {
              navigate(Pages.dashboard);
            }
          }}
          onLogin={async (form) => {
            if (await user.login(form.username, form.password)) {
              navigate(Pages.dashboard);
            }
          }} />
      </Card>
    </Flex>
  )
}