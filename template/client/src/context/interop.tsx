import React from "react";
import { ApiService } from "../services/api";
import { useUserContext } from "./user";
import { Api } from "../../../shared/routes/api";
import { InteropRequests } from "../../../shared/requests/interop";
import { InteropResponses } from "../../../shared/responses/interop";
import { ResponseValidator } from "../../../shared/responses/base";
import { Log } from "./logger/logger";

export interface IInteropContext {
  searchGitBranches(cwd: string, pattern: string): Promise<string[]>;
  searchDirectory(directory: string): Promise<string[]>;
}

const InteropContext_React = React.createContext<IInteropContext | null>(null);

export interface InteropContextProps {
  children: React.ReactNode;
}
export function InteropContext(props: InteropContextProps) {
  const tag = 'InteropContext';
  const user = useUserContext();

  const searchGitBranches = async (cwd: string, pattern: string): Promise<string[]> => {
    const request: InteropRequests.ExecCommand = {
      command: 'git branch --list -a ' + pattern,
      cwd: cwd
    }
    const response = await ApiService.getInstance()
      .useJwt(user.user?.jwt || '')
      .postTo(Api.Interop.exec)
      .withBody<InteropResponses.ExecCommand>(request);
    if (ResponseValidator.isError(response)) {
      Log.error(tag, `Error searching git branches: ${response.message}`);
      return [];
    }
    return response.stdout.split('\n')
  }

  const searchDirectory = async (directory: string): Promise<string[]> => {
    const request: InteropRequests.ScanDirectory = {
      directory: directory
    }
    const response = await ApiService.getInstance()
      .useJwt(user.user?.jwt || '')
      .postTo(Api.Interop.scanDirectory)
      .withBody<InteropResponses.ScanDirectory>(request);
    if (ResponseValidator.isError(response)) {
      Log.error(tag, `Error scanning directory: ${response.message}`);
      return [];
    }
    return response.files;
  }
  
  return (
    <InteropContext_React.Provider value={{
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