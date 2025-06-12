import { Card, Form, Input, Typography } from 'antd';
import './dashboard.scss';
import { useInteropContext } from '../../../context/interop';
import { useEffect, useState } from 'react';

export interface DashboardProps { }

export function Dashboard(props: DashboardProps) {
  const apiContext = useInteropContext();
  const [project, setProject] = useState('');
  useEffect(() => {
    const scanDir = async () => {
      const result = await apiContext.searchDirectory(project);
    }
    scanDir();
  }, []);
  return (
    <Card>
      <Typography.Title>
        Dashboard
      </Typography.Title>
      <Card title="Git Tools">
        <Form>
          <Form.Item label="Project Path">
            <Input type="text" placeholder="Full Project Path" onChange={(ev) => setProject(ev.target.value)}/>
          </Form.Item>
          <Form.Item label="Branch">
            <Input type="text" placeholder="Enter Branch Name" 
            onChange={(ev) => {
              apiContext.searchGitBranches(project, ev.target.value+'*')
            }}/>
          </Form.Item>
        </Form>
      </Card>
    </Card>
  )
}