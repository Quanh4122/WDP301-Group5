import { ConfigProvider } from 'antd';
import Router from './presentation/routes/Router';
import 'react-toastify/dist/ReactToastify.css';




function App() {
  return (
    <ConfigProvider>
      <Router />
    </ConfigProvider>
  );
}

export default App;
