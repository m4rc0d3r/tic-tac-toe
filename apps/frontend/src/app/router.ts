import { createBrowserRouter, Outlet } from "react-router";

import { RootLayout } from "./root-layout";

import { withConditionalAccess } from "~/features/routing2";
import { AboutPage } from "~/pages/about";
import { HomePage } from "~/pages/home";
import { LoginPage } from "~/pages/login";
import { RegistrationPage } from "~/pages/registration";
import { SettingsPage } from "~/pages/settings";
import { ROUTES } from "~/shared/routing";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        Component: RootLayout,
        children: [
          {
            index: true,
            Component: HomePage,
          },
          {
            path: ROUTES.about,
            Component: AboutPage,
          },
          {
            path: ROUTES.settings,
            Component: withConditionalAccess({
              component: SettingsPage,
              allowFor: "AUTHENTICATED",
            }),
          },
        ],
      },
      {
        Component: withConditionalAccess({
          component: Outlet,
          allowFor: "UNAUTHENTICATED",
        }),
        children: [
          {
            path: ROUTES.registration,
            Component: RegistrationPage,
          },
          {
            path: ROUTES.login,
            Component: LoginPage,
          },
        ],
      },
    ],
  },
]);

export { router };
