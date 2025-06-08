import { Card, Typography } from 'antd';
import './dashboard.scss';
import { useState } from 'react';
import { BasePage } from '../basePage';
import { Logo } from '../../components/logo/logo';

export interface DashboardProps { }

export function Dashboard(props: DashboardProps) {
  return (
    <BasePage
      withSlider
      label={(
        <Logo />
      )}>
      <Card>
        <Typography.Title>
          Dashboard
        </Typography.Title>
      </Card>
    </BasePage>
  )
}