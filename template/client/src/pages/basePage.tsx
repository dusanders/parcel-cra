import './basePage.scss';
import { App, Layout, theme } from "antd";
import { Header } from "../components/header/header";
import React, { } from "react";
import { Footer } from "../components/footer/footer";
import { Sider } from '../components/sider/sider';
import { MenuItemType } from 'antd/es/menu/interface';

export interface BasePageProps {
  label?: React.ReactElement;
  withSlider?: boolean;
  sliderOptions?: MenuItemType[];
  onSiderOptionSelected?: (option: MenuItemType) => void;
  children?: any;
}
export function BasePage(props: BasePageProps) {
  const tag = 'BasePage.tsx';
  const { token } = theme.useToken();

  return (
    <Layout className='basePage-root'>
      {props.withSlider && (
        <Sider
          onOptionSelected={(opt) => {
            if(props.onSiderOptionSelected){
              props.onSiderOptionSelected(opt)
            }
          }}
          options={props.sliderOptions || []}
          label={props.label} />
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