import { Button, Card, Col, Divider, Form, Input, Menu, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { DirectoryScan } from "./directoryScan";
import { useInteropContext } from "../../../context/interop";
import { removeDuplicates } from "../../../utils/utils";

export interface GitToolsProps {

}

export function GitTools(props: GitToolsProps) {
  const branchListSpan = 8;
  const formInputSpan = 24 - branchListSpan;
  const apiContext = useInteropContext();
  const [project, setProject] = useState('');
  const [branches, setBranches] = useState<string[]>([]);
  const [branchFilter, setBranchFilter] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [gitOrigin, setGitOrigin] = useState<string>('');
  const [isFileAvailable, setIsFileAvailable] = useState(false);
  const [licenseHref, setLicenseHref] = useState<string>('');

  const removeOriginPrefix = (branch: string) => {
    return branch.replace('remotes/origin/', '').replace('origin/', '').replace('HEAD -> ', '')
  }

  const updateBranches = async () => {
    if (!Boolean(project)) {
      return;
    }
    const result = await apiContext.searchGitBranches(project, branchFilter);
    setBranches(result.branches);
    setGitOrigin(result.originUrl);
    if(!selectedBranch || !result.branches.find((branch) => branch === selectedBranch)) {
      setSelectedBranch(result.branches[0])
    }
  }

  const checkFile = async () => {
    if (Boolean(selectedBranch)) {
      const isAvailable = await apiContext.checkGitFile(project, selectedBranch, 'server/package.json');
      setIsFileAvailable(isAvailable.length > 0);
    }
  }

  useEffect(() => {
    const url = `${gitOrigin.replace('.git', '')}/blob/${selectedBranch}/package.json`;
    setLicenseHref(url);
    checkFile();
  }, [selectedBranch]);

  useEffect(() => {
    updateBranches();
  }, [project, branchFilter, selectedBranch]);

  return (
    <Card title="Git Tools">
      <Row gutter={(16 + (8 * 2))}>
        <Col span={formInputSpan} >
          <Form>
            <Form.Item label="Project Path">
              <DirectoryScan onDirectoryChanged={(directory) => {
                setProject(directory);
              }} />
            </Form.Item>
            <Input
              type="text"
              disabled
              placeholder="Full Project Path"
              value={project} />
            <Form.Item label="Branch" className='branch-form-item'>
              <Input type="text" placeholder="Enter Branch Name"
                onChange={async (ev) => {
                  if (!Boolean(ev.target.value)) {
                    setBranchFilter('');
                    return;
                  }
                  setBranchFilter(ev.target.value);
                }} />
            </Form.Item>
          </Form>
          <Button type={'default'}
            disabled={!Boolean(isFileAvailable)}
            onClick={() => {
              apiContext.exportGitFile(project, selectedBranch, 'package.json');
            }}
            style={{ cursor: 'pointer' }}>
            Export package.json
          </Button>
        </Col>
        <Col span={branchListSpan}>
          <Typography.Paragraph className="branch-list-title"
            strong>
            Available Branches
          </Typography.Paragraph>
          <Divider className="branch-list-divider" />
          <Menu
            className="branch-list"
            onClick={(info) => {
              console.log(`Clicked branch: ${info.key}`);
              setSelectedBranch(info.key);
            }}
            selectedKeys={[selectedBranch]}
            mode={'vertical'}
            items={
              branches.map((branch, index) => ({
                key: branch,
                label: (
                  <Typography.Text>
                    {removeOriginPrefix(branch)}
                  </Typography.Text>
                )
              }))
            } />
        </Col>
      </Row>
    </Card>
  )
}