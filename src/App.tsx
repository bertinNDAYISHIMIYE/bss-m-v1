import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { authProvider, dataProvider, liveProvider } from "./providers";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Home, ForgotPassword, Register, Login, CompanyList } from "./pages";
import Layout from "./components/layout";
import { resources } from "./components/config/resources";
import Create from "./pages/company/create";
import Edit from "./pages/company/edit";
import List from "./pages/tasks/list";
import CreateTask from "./pages/tasks/create";
import EditTask from "./pages/tasks/edit";


function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                 authProvider={authProvider}
                 resources={resources}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  // projectId: "936cHh-2wBRfI-anu8JR",
                  // liveMode: "auto",
                }}
              >
                <Routes>

                  <Route path="/register" element={<Register />}></Route>
                  <Route path="/login" element={<Login />}></Route>
                  <Route path="forgot-password" element={<ForgotPassword />}></Route>
                  <Route 
                  element={
                  <Authenticated
                  key="authenticated-layout"
                fallback={<CatchAllNavigate to="/login"/>}
                >
                <Layout>
                  <Outlet />
                </Layout>
              </Authenticated>
            }>
              <Route index element={<Home />}></Route>
              <Route path='/companies'>
                <Route index element={<CompanyList />} />
                <Route path='new' element={<Create />} />
                <Route path='edit/:id' element={<Edit />} />
              </Route>
              <Route path='/tasks' element={
                <List>
                  <Outlet />
                </List>
              }>
                <Route path='new' element={<CreateTask />} />
                <Route path='edit/:id' element={<EditTask />} />
              </Route>
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
