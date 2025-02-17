import { createBrowserRouter } from "react-router";

import { AboutPage } from "~/pages/about";
import { HomePage } from "~/pages/home";

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
    ],
  },
]);

export { router };
