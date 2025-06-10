import { Card, Flex } from 'antd';
import './login.scss';
import { LoginForm } from './loginForm/loginForm';
import { useUserContext } from '../../context/user';
import { LandingPrompt } from './landingPrompt/landingPrompt';
import { BasePage } from '../basePage';
import { Pages } from '../../../../shared/routes/pages';
import { useNavigate } from 'react-router';

export interface LoginProps {

}

export function Login(props: LoginProps) {
  const user = useUserContext();
  const navigate = useNavigate();
  return (
    <BasePage>
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
    </BasePage>
  )
}