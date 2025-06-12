import { Card, Typography } from 'antd';
import './dashboard.scss';

export interface DashboardProps { }

export function Dashboard(props: DashboardProps) {
  return (
    <Card>
      <Typography.Title>
        Dashboard
      </Typography.Title>
    </Card>
  )
}