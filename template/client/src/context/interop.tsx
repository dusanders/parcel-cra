import React from "react";
import { ApiService } from "../services/api";
import { useUserContext } from "./user";
import { Api } from "../../../shared/routes/api";
import { InteropRequests } from "../../../shared/requests/interop";
import { InteropResponses } from "../../../shared/responses/interop";
import { ResponseValidator } from "../../../shared/responses/base";
import { Log } from "./logger/logger";

export interface IInteropContext {
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
      Log.error(tag, `Error searching git branches: ${response.message}`);
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
      Log.error(tag, `Error scanning directory: ${response.message}`);
      return {
        files: [],
        scanDirectory: ''
      };
    }
    return response;
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