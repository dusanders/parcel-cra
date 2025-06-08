import './basePage.scss';
import { Layout, theme } from "antd";
import { Header } from "../components/header/header";
import React, {  } from "react";
import { Footer } from "../components/footer/footer";
import { Sider } from '../components/sider/sider';
import { MenuItemType } from 'antd/es/menu/interface';
import { Log } from '../context/logger/logger';
import { useUserContext } from '../context/user';

export interface BasePageProps {
  label?: React.ReactElement;
  withSlider?: boolean;
  sliderOptions?: MenuItemType[];
  children?: any;
}
export function BasePage(props: BasePageProps) {
  const tag = 'BasePage.tsx';
  const { token } = theme.useToken();
  const user = useUserContext();
  return (
    <Layout className='basePage-root'>
      {props.withSlider && (
        <Sider
          options={props.sliderOptions || []}
          label={props.label} 
          onOptionSelected={(option) => {
            Log.info(tag, `selected: ${option.key}`);
            if(option.key === 'logout') {
              user.logout();
            }
          }}/>
      )}
      <Layout>
        <Header />
        <Layout.Content className='basePage-content'>
          {props.children}
        </Layout.Content>
      </Layout>
      <Footer className={'basePage-footer'} />
    </Layout>
  )
}