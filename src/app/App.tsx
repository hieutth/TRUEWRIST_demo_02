import { RouterProvider } from "react-router";
import { router } from "./routes";
import { WatchStoreProvider } from "./context/WatchStore";

export default function App() {
  return (
    <WatchStoreProvider>
      <RouterProvider router={router} />
    </WatchStoreProvider>
  );
}
