import { createBrowserRouter } from "react-router";

import { AboutPage } from "~/pages/about";
import { HomePage } from "~/pages/home";
import { LoginPage } from "~/pages/login";
import { RegistrationPage } from "~/pages/registration";
import { ROUTES } from "~/shared/routing";

const router = createBrowserRouter([
  {
    path: "/",
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
        path: ROUTES.registration,
        Component: RegistrationPage,
      },
      {
        path: ROUTES.login,
        Component: LoginPage,
      },
    ],
  },
]);

export { router };
