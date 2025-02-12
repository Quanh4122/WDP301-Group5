import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ConfigProvider } from 'antd';
import AppTheme from './presentation/assets/themes';
import Router from './presentation/routes/Router';

function App() {
  return (
    <ConfigProvider theme={AppTheme}>
      <Router />
    </ConfigProvider>
  );
}

export default App;
