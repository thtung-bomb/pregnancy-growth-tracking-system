import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "aos/dist/aos.css";
import { StateProvider } from "./context/stateProvider";
import "./index.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ConfigProvider } from "antd";
import { themeAntd } from "./config/antd";
import { HelmetProvider } from 'react-helmet-async';
// AOS.init({
//   // initialise with other settings
//   duration: 1000,
// });
function App() {

  return (
    <>
      <ConfigProvider theme={themeAntd}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StateProvider>
              <HelmetProvider>
                <RouterProvider router={router} />
              </HelmetProvider>
              <ToastContainer />
            </StateProvider>
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </>
  );
}

export default App;
