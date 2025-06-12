import React from 'react';
import { BasePage } from '../basePage';
import { Outlet } from 'react-router';


export interface NoAuthLayoutProps {
  
}

export function NoAuthLayout(props: NoAuthLayoutProps) {
  return (
    <BasePage>
      <Outlet />
    </BasePage>
  )
}