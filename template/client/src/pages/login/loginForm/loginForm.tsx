import { Button, Card, Flex, Form, Input } from 'antd';
import './loginForm.scss';

export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginFormProps {
  onCreate(req: LoginFormData): void;
  onLogin(req: LoginFormData): void;
}

export function LoginForm(props: LoginFormProps) {
  return (
    <Form
      className='login-form-root'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={(formValues: LoginFormData) => {
        const submitter = document.activeElement?.getAttribute('value');
        if (submitter === 'create') {
          props.onCreate(formValues);
        } else if (submitter === 'login') {
          props.onLogin(formValues);
        }
      }}>
      <Form.Item
        label={'Username'}
        name={'username'}>
        <Input type={'name'} />
      </Form.Item>
      <Form.Item
        label={'Password'}
        name={'password'}>
        <Input type='password' />
      </Form.Item>
      <Flex align='center' justify='center' gap="large"
      >
        <Button className='button'
          name='submit'
          value={'login'}
          htmlType='submit'
          type="primary" >
          Login
        </Button>
        <Button className='button'
          name='submit'
          value={'create'}
          htmlType='submit'>
          Create
        </Button>
      </Flex>
    </Form>
  )
}