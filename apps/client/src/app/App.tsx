import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { antdTheme } from '../shared/theme/antd.theme';
import { AppRouter } from './router';

export function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ConfigProvider>
  );
}
