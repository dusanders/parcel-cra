import { Button, Card, Col, Divider, Form, Input, Menu, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { DirectoryScan } from "../../../components/directoryScan/directoryScan";
import { useInteropContext } from "../../../context/interop";

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
  const [licenseHref, setLicenseHref] = useState<string>('');

  const updateBranches = async () => {
    if (!Boolean(project)) {
      return;
    }
    const result = await apiContext.searchGitBranches(project, branchFilter);
    setBranches([
      ...result.branches,
    ]);
    setGitOrigin(result.originUrl);
    setSelectedBranch(result.branches[0] || '');
  }

  useEffect(() => {
    const sanitize = selectedBranch.replace('remotes/origin/', '').replace('origin/', '');
    const url = `${gitOrigin.replace('.git', '')}/blob/${sanitize}/package.json`;
    setLicenseHref(url);
  }, [selectedBranch]);

  useEffect(() => {
    updateBranches();
  }, [project, branchFilter]);

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
                  setBranchFilter(ev.target.value + '*');
                }} />
            </Form.Item>
          </Form>
          <Button type={'default'}
            disabled={!Boolean(selectedBranch)}
            href={licenseHref}
            target="_blank"
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
                    {branch}
                  </Typography.Text>
                )
              }))
            } />
        </Col>
      </Row>
    </Card>
  )
}