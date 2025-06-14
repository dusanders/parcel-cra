import { createContext, useContext, useEffect, useState } from "react";
import { ApiService } from "../services/api";
import { Api } from "../../../shared/routes/api";
import { UserRequests } from "../../../shared/requests/user";
import { ResponseValidator } from "../../../shared/responses/base";
import { UserResponses } from "../../../shared/responses/user";
import { User } from "../../../shared/models/user";
import { Loading } from "../pages/fragments/loading/loading";
import { BasePage } from "../pages/basePage";
import { useThemeContext } from "./theme/theme";
import { useNavigate } from "react-router";
import { Pages } from "../../../shared/routes/pages";

/**
 * Define the logic for the User context
 */
export interface IUserContext {
  /**
   * Current user model
   */
  user?: User;
  /**
   * Most recent user model
   */
  mostRecentUser?: User;
  /**
   * Login a user
   * @param name 
   * @param secret 
   */
  login(name: string, secret: string): Promise<boolean>;
  /**
   * Logout a user
   */
  logout(): void;
  /**
   * Create a user
   * @param name 
   * @param secret 
   */
  create(name: string, secret: string): Promise<boolean>;
  /**
   * Update a user
   * @param user 
   */
  update(user: User): Promise<boolean>;
}

/**
 * React context instance. Do not use - use the HoC and hook instead.
 */
export const UserContext_React = createContext({} as IUserContext);

/**
 * Define the props
 */
export interface UserProviderProps {
  children?: any;
}

const UserModelKey = 'user';
/**
 * Implement the context
 * @param props 
 * @returns 
 */
export function UserContext(props: UserProviderProps) {
  const theme = useThemeContext();
  const router = useNavigate();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const saveUser = (user?: User) => {
    if (!user) {
      localStorage.removeItem(UserModelKey);
      setUser(undefined);
      router(Pages.login)
    } else {
      localStorage.setItem(UserModelKey, JSON.stringify(user));
      setUser(user);
    }
    setLoaded(true);
  }
  const login = async (name: string, secret: string) => {
    const request: UserRequests.Create = {
      name: name,
      secret: secret
    }
    const response = await ApiService.getInstance()
      .notAuthenticated()
      .postTo(Api.User.login)
      .withBody<UserResponses.Auth>(request);
    if (ResponseValidator.isError(response)) {
      return false;
    }
    response.user.hasAuth = true;
    saveUser(response.user);
    theme.setNewSeed(response.user.theme);
    return true;
  }
  const logout = () => {
    saveUser(undefined);
  }
  const create = async (name: string, secret: string) => {
    const request: UserRequests.Create = {
      name: name,
      secret: secret
    }
    const response = await ApiService.getInstance()
      .notAuthenticated()
      .postTo(Api.User.create)
      .withBody<UserResponses.Create>(request);
    if (ResponseValidator.isError(response)) {
      return false;
    }
    response.user.hasAuth = true;
    saveUser(response.user);
    theme.setNewSeed(response.user.theme)
    return true;
  }
  const verifyJwt = async (jwt: string) => {
    const response = await ApiService.getInstance()
      .useJwt(jwt)
      .postTo(Api.User.verify)
      .noBody();
    if (ResponseValidator.isError(response)) {
      return false;
    }
    return true;
  }
  const update = async (user: User) => {
    const request: UserRequests.Update = {
      newValues: {
        id: user.id,
        theme: user.theme
      }
    };
    const response = await ApiService.getInstance()
      .useJwt(user.jwt)
      .postTo(Api.User.update)
      .withBody<UserResponses.Update>(request);
    if (ResponseValidator.isError(response)) {
      return false;
    }
    response.user.hasAuth = true;
    saveUser(response.user);
    theme.setNewSeed(response.user.theme);
    return true;
  }

  useEffect(() => {
    const doVerify = async () => {
      const userJson = localStorage.getItem(UserModelKey);
      if (userJson) {
        const userModel = JSON.parse(userJson) as User;
        const isVerified = await verifyJwt(userModel.jwt);
        if (!isVerified) {
          saveUser(undefined);
          return;
        }
        if (userModel) {
          userModel.hasAuth = true;
          router(Pages.dashboard)
          saveUser(userModel);
          theme.setNewSeed(userModel.theme)
        }
      } else {
        saveUser(undefined);
      }
    }
    setTimeout(() => {
      doVerify()
    }, 500);
  }, []);

  return (
    <UserContext_React.Provider value={{
      mostRecentUser: user,
      user: user,
      login: (name, secret) => login(name, secret),
      logout: () => logout(),
      create: (name, secret) => create(name, secret),
      update: (user) => update(user)
    }}>
      {loaded && (props.children)}
      {!loaded && (
        <BasePage>
          <Loading />
        </BasePage>
      )}
    </UserContext_React.Provider>
  )
}

/**
 * Convenience hook to use the User context
 * @returns 
 */
export function useUserContext() {
  return useContext(UserContext_React);
}