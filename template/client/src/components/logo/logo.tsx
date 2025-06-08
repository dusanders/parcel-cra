import { Html5Outlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";

export interface LogoProps {

}

export function Logo(props: LogoProps) {
  return (
    <Flex style={{
      flexGrow: 1
    }}>
      <Typography>
        <Html5Outlined style={{
          padding: '0.5rem'
        }}/>
        Logo
      </Typography>
    </Flex>
  )
}