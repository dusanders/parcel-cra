import { createContext, useContext, useState } from "react";
import { User } from "../../../shared";
import { AxiosUtils } from "../services/axios";
import { Api } from "../../../shared/routes/api";
import { UserRequests } from "../../../shared/requests/user";
import { ResponseValidator } from "../../../shared/responses/base";

export interface IUserContext {
  user?: User;
  login(name: string, secret: string): Promise<boolean>;
  create(name: string, secret: string): Promise<boolean>;
}

export const UserContext_React = createContext({} as IUserContext);

export interface UserProviderProps {
  children?: any;
}

export function UserContext(props: UserProviderProps) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const login = async (name: string, secret: string) => {
    const api = AxiosUtils.withDefaultAxios();
    const request: UserRequests.Create = {
      name: name,
      secret: secret
    }
    const response = await api.post(
      Api.User.login,
      request
    );
    if (ResponseValidator.isError(response.data)) {
      return false;
    }
    setUser(response.data);
    return true;
  }
  const create = async (name: string, secret: string) => {
    const api = AxiosUtils.withDefaultAxios();
    const request: UserRequests.Create = {
      name: name,
      secret: secret
    }
    const response = await api.post(
      Api.User.login,
      request
    );
    if (ResponseValidator.isError(response.data)) {
      return false;
    }
    setUser(response.data);
    return true;
  }
  return (
    <UserContext_React.Provider value={{
      user: user,
      login: (name, secret) => login(name, secret),
      create: (name, secret) => create(name, secret)
    }}>
      {props.children}
    </UserContext_React.Provider>
  )
}

export function useUserContext() {
  return useContext(UserContext_React);
}