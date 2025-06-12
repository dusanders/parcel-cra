import React, { useEffect } from "react";
import { BasePage } from "../basePage";
import { Logo } from "../../components/logo/logo";
import { Outlet, useNavigate } from "react-router";
import { useUserContext } from "../../context/user";
import { Pages } from "../../../../shared/routes/pages";

export interface AuthPathProps {

}

export function AuthLayout(props: AuthPathProps) {
  const navigate = useNavigate();
  const user = useUserContext();
  const canRoute = () => {
    return user && user.user?.hasAuth
  }
  useEffect(() => {
    console.log(`auth guard: ${user.user?.name}`);
    if (!canRoute()) {
      navigate(Pages.login);
    }
  })
  return (
    <BasePage
      withSlider
      onSiderOptionSelected={(option) => {
        navigate(option.key as Pages)
      }}
      label={(
        <Logo />
      )}>
      {canRoute() && (
        <Outlet />
      )}
    </BasePage>
  )
}