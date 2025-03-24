import { ConfigProvider } from 'antd';
import Router from './presentation/routes/Router';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



function App() {
  return (
    <ConfigProvider>
      <ToastContainer/>
      <Router />
    </ConfigProvider>
  );
}

export default App;
