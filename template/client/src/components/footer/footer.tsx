import { Anchor, Flex, Layout, Typography } from 'antd';
import './footer.scss';

export interface FooterProps {
  className?: string;
}

export function Footer(props: FooterProps) {
  return (
    <Layout.Footer className={`footer-root ${props.className || ''}`}>
      <Flex>
        <p>Template by
          <span>
            <Typography.Link type={'secondary'}
              href='https://dusanders.github.io'
              target='about:blank'>
              dusanders
            </Typography.Link>
          </span>
        </p>
      </Flex>
    </Layout.Footer>
  )
}