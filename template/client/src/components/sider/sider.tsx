import { UserOutlined, VideoCameraOutlined, UploadOutlined, MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useEffect, useState } from "react";
import { Log } from "../../context/logger/logger";
import { MenuItemType } from "antd/es/menu/interface";

const baseOptions: MenuItemType[] = [
  {
    key: 'dashboard',
    icon: <UserOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Logout',
  },
]

export interface SiderProps {
  options?: MenuItemType[];
  onOptionSelected?: (option: MenuItemType) => void;
  label?: React.ReactElement;
}

export function Sider(props: SiderProps) {
  const tag = 'Sider.tsx';
  const { token } = theme.useToken();
  const [sliderState, setSliderState] = useState(false);
  const [expandedStyleTag, setExpandedStyleTag] = useState('');
  useEffect(() => {
    if (sliderState) {
      setExpandedStyleTag('')
    } else {
      setExpandedStyleTag('expanded')
    }
  }, [sliderState]);
  const allOptions: MenuItemType[] = [
    ...baseOptions,
    ...props.options || []
  ]
  return (
    <Layout.Sider trigger={null}
      collapsible
      collapsed={sliderState}>
      <div className={`basePage-side-button-parent ${expandedStyleTag}`}>
        <div className={`basePage-side-button-label ${expandedStyleTag}`}>
          {props.label}
        </div>
        <Button
          color={'primary'}
          className={`basePage-side-button ${expandedStyleTag}`}
          type="text"
          icon={sliderState ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setSliderState(!sliderState)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
      </div>
      <Menu
        onSelect={(info) => {
          const found = allOptions.find(i => i.key === info.key);
          if (props.onOptionSelected && found) {
            props.onOptionSelected(found);
          }
        }}
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[allOptions[0].key.toString()]}
        items={allOptions}
      />
    </Layout.Sider>
  )
}