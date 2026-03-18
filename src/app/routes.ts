import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Collections } from "./pages/Collections";
import { ProductDetail } from "./pages/ProductDetail";
import { CreatorStudio } from "./pages/CreatorStudio";
import { VendorDashboard } from "./pages/VendorDashboard";
import { MyAccount } from "./pages/MyAccount";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "collections", Component: Collections },
      { path: "product/:id", Component: ProductDetail },
      { path: "creator-studio", Component: CreatorStudio },
      { path: "vendor", Component: VendorDashboard },
      { path: "account", Component: MyAccount },
      { path: "*", Component: NotFound },
    ],
  },
]);
