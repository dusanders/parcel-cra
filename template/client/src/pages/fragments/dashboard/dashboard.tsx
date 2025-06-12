import { Card, Form, Input, Typography } from 'antd';
import './dashboard.scss';
import { useInteropContext } from '../../../context/interop';
import { useEffect, useState } from 'react';
import { GitTools } from './gitTools';

export interface DashboardProps { }

export function Dashboard(props: DashboardProps) {
  const apiContext = useInteropContext();
  const [project, setProject] = useState('');

  return (
    <Card className='dashboard-root'>
      <Typography.Title>
        Dashboard
      </Typography.Title>
      <GitTools />
    </Card>
  )
}