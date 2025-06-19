import React from "react";
import { ApiService } from "../services/api";
import { useUserContext } from "./user";
import { Api } from "../../../shared/routes/api";
import { InteropRequests } from "../../../shared/requests/interop";
import { InteropResponses } from "../../../shared/responses/interop";
import { ResponseValidator } from "../../../shared/responses/base";
import { Log } from "./logger/logger";
import { GitTreeItem } from "../../../shared/models/user";

export interface IInteropContext {
  bashScript(cwd: string, args: string[]): Promise<void>;
  checkGitFile(cwd: string, branch: string, filePath: string): Promise<GitTreeItem[]>;
  exportGitFile(cwd: string, branch: string, filePath: string): Promise<void>;
  searchGitBranches(cwd: string, pattern: string): Promise<InteropResponses.GitSearchBranches>;
  searchDirectory(directory: string): Promise<InteropResponses.ScanDirectory>;
}

const InteropContext_React = React.createContext<IInteropContext | null>(null);

export interface InteropContextProps {
  children: React.ReactNode;
}
export function InteropContext(props: InteropContextProps) {
  const tag = 'InteropContext';
  const user = useUserContext();

  const checkGitFile = async (cwd: string, branch: string, filePath: string) => {
    const request: InteropRequests.GitHasFile = {
      rootDirectory: cwd,
      branch: branch,
      filePath: filePath
    }
    const response = await ApiService.getInstance()
      .useJwt(user.user?.jwt || '')
      .postTo(Api.Interop.gitHasFile)
      .withBody<InteropResponses.GitHasFile>(request);
    if (ResponseValidator.isError(response)) {
      Log.warn(tag, `Error checking git file: ${response.message}`);
      return [];
    }
    return response.files;
  }

  const exportGitFile = async (cwd: string, branch: string, filePath: string): Promise<void> => {
    const request: InteropRequests.GitExportFile = {
      branch: branch,
      filePath: filePath,
      rootDirectory: cwd
    }
    const response = await ApiService.getInstance()
      .useJwt(user.user?.jwt || '')
      .postTo(Api.Interop.gitExportFile)
      .withBodyExpectDownload(request);
    if (ResponseValidator.isError(response)) {
      Log.warn(tag, `Error exporting git file: ${response.message}`);
    }
  }

  const searchGitBranches = async (cwd: string, pattern: string): Promise<InteropResponses.GitSearchBranches> => {
    const request: InteropRequests.GitSearchBranches = {
      pattern: pattern,
      rootDirectory: cwd
    }
    const response = await ApiService.getInstance()
      .useJwt(user.user?.jwt || '')
      .postTo(Api.Interop.searchGitBranches)
      .withBody<InteropResponses.GitSearchBranches>(request);
    if (ResponseValidator.isError(response)) {
      Log.warn(tag, `Error searching git branches: ${response.message}`);
      return {
        branches: [],
        originUrl: ''
      };
    }
    return response;
  }

  const searchDirectory = async (directory: string) => {
    const request: InteropRequests.ScanDirectory = {
      directory: directory
    }
    const response = await ApiService.getInstance()
      .useJwt(user.user?.jwt || '')
      .postTo(Api.Interop.scanDirectory)
      .withBody<InteropResponses.ScanDirectory>(request);
    if (ResponseValidator.isError(response)) {
      Log.warn(tag, `Error scanning directory: ${response.message}`);
      return {
        files: [],
        scanDirectory: ''
      };
    }
    return response;
  }

  const runBashScript = async (cwd: string, args: string[]) => {
    const request: InteropRequests.BashScript = {
      cwd: cwd,
      args: args
    }
    const response = await ApiService.getInstance()
      .useJwt(user.user?.jwt || '')
      .postTo(Api.Interop.bashScript)
      .withBody<InteropResponses.BashScript>(request);
  }

  return (
    <InteropContext_React.Provider value={{
      bashScript: (cwd, args) => runBashScript(cwd, args),
      checkGitFile: (cwd, branch, filePath) => checkGitFile(cwd, branch, filePath),
      exportGitFile: (cwd, branch, filePath) => exportGitFile(cwd, branch, filePath),
      searchGitBranches: (cwd, pattern) => searchGitBranches(cwd, pattern),
      searchDirectory: (dir) => searchDirectory(dir)
    }}>
      {props.children}
    </InteropContext_React.Provider>
  );
}
export function useInteropContext() {
  const context = React.useContext(InteropContext_React);
  if (context === null) {
    throw new Error("useInteropContext must be used within a InteropContext");
  }
  return context;
}