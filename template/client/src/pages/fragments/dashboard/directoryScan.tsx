import React, { useEffect } from "react";
import { useInteropContext } from "../../../context/interop";
import { Breadcrumb } from "antd";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";

export interface DirectoryScanProps {
  onDirectoryChanged?: (directory: string) => void;
}

export function DirectoryScan(props: DirectoryScanProps) {
  const apiContext = useInteropContext();
  const [files, setFiles] = React.useState<string[]>([]);
  const [directory, setDirectory] = React.useState<string>('');

  const scanDirectory = async (dir?: string) => {
    const result = await apiContext.searchDirectory(dir || '');
    setFiles(result.files);
    setDirectory(result.scanDirectory);
  }
  useEffect(() => {
    scanDirectory(directory);
    if(props.onDirectoryChanged) {
      props.onDirectoryChanged(directory);
    }
  }, [directory]);

  const directoryToBreadcrumb = (dir: string): Partial<BreadcrumbItemType>[] => {
    const parts = dir.split('/');
    return parts.map((part, index) => {
      return {
        title: part,
        menu: index < parts.length - 1 ? undefined : {
          items: files.map(file => ({
            key: file,
            label: file,
            onClick: () => {
              setDirectory(`${dir}/${file}`);
            }
          }))
        },
        onClick: () => {
          setDirectory(parts.slice(0, index + 1).join('/'));
        },
      }
    });
  }
  return (
    <Breadcrumb
      items={directoryToBreadcrumb(directory)} />
  )
}