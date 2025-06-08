import { ColorPicker, Flex, Layout, Switch } from 'antd'
import { useThemeContext } from '../../context/theme/theme'
import './header.scss';
import { SunOutlined } from '@ant-design/icons';

export interface HeaderProps {

}

export function Header(props: HeaderProps) {
  const theme = useThemeContext()
  return (
    <Layout.Header className='header'>
      <Flex align='end' gap={'large'} justify='end'
      className='component-flexbox'>
        <ColorPicker className='color-picker' showText value={theme.current} onChange={(val, css) => {
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
    </Layout.Header>
  )
}