import { Flex, Spin } from "antd";
import React from "react";
import './loading.scss';

export interface LoadingProps {
  /**
   * Optional message to display while loading
   */
  message?: string;
}
export function Loading(props: LoadingProps) {
  return (
    <Flex className="loading-root">
      <Flex>
        <Spin className="spinner" size={'large'} />
      </Flex>
    </Flex>
  )
}

const styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 10,
  },
}