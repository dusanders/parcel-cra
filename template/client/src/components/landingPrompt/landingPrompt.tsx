import './landingPrompt.scss';
import { Flex } from "antd";

export interface LandingPromptProps {

}

export function LandingPrompt(props: LandingPromptProps) {
  return (
    <Flex
      className="landing-prompt-root"
      vertical
      align="center"
      justify="center">
      <h1>Parcel React App 2</h1>
      <h3>Template by dusanders!</h3>
      <p>Edit <code>src/App.tsx</code> to get started!</p>
    </Flex>
  )
}