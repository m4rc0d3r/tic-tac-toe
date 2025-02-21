import { createBrowserRouter } from "react-router";

import { AboutPage } from "~/pages/about";
import { HomePage } from "~/pages/home";
import { LoginPage } from "~/pages/login";
import { RegistrationPage } from "~/pages/registration";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "about",
        Component: AboutPage,
      },
      {
        path: "register",
        Component: RegistrationPage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
    ],
  },
]);

export { router };
