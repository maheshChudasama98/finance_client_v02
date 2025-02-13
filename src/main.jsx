import { Suspense } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { store } from 'src/redux/store/index';

import 'src/assets/styles/styles.css'

// import { App as AntdApp } from "antd";

import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <Provider store={store}>
      <BrowserRouter>
        <Suspense>
          {/* <AntdApp> */}
            <App />
          {/* </AntdApp> */}
        </Suspense>
      </BrowserRouter>
    </Provider>
  </HelmetProvider>
);
