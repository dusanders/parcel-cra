import { Button, ColorPicker, Flex, Layout, Switch, Typography } from 'antd'
import { useThemeContext } from '../../context/theme/theme'
import './header.scss';
import { MenuFoldOutlined, MenuUnfoldOutlined, SunOutlined } from '@ant-design/icons';
import { useUserContext } from '../../context/user';
import { useState } from 'react';

export interface HeaderProps {
  // None
}

export function Header(props: HeaderProps) {
  const theme = useThemeContext();
  const userContext = useUserContext();
  return (
    <Layout.Header className='header-root'>
      <Flex className='title-text'>
        {userContext.user && userContext.user.hasAuth && (
          <Typography.Paragraph className='title-text'>
            Welcome {userContext.user.name}
          </Typography.Paragraph>
        )}
        {!userContext.user && (
          <Typography.Paragraph>
             
          </Typography.Paragraph>
        )}
      </Flex>
      <Flex gap={'large'}
        className='theme-controls-flexbox'>
        <Flex gap={'large'}>
          <ColorPicker className='color-picker'
            showText
            value={theme.current}
            onChange={(val, css) => {
              theme.setNewSeed(val.toHexString())
            }} />
          <Flex gap={'middle'} className='switch-flexbox'
            justify='center' align='center'>
            <SunOutlined />
            <Switch checked={!theme.isDarkTheme()} onChange={(checked) => {
              theme.toggleDarkTheme();
            }} />
          </Flex>
        </Flex>
      </Flex>
    </Layout.Header>
  )
}