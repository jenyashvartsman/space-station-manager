import { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import styles from './StationLayout.module.scss';

const { Sider, Header, Content } = Layout;

const NAV_ITEMS = [
  { key: '/', label: 'Dashboard', icon: <DashboardOutlined /> },
  { key: '/crew', label: 'Crew', icon: <TeamOutlined /> },
  { key: '/modules', label: 'Modules', icon: <AppstoreOutlined /> },
  { key: '/missions', label: 'Missions', icon: <RocketOutlined /> },
  { key: '/resources', label: 'Resources', icon: <ThunderboltOutlined /> },
  { key: '/events', label: 'Events', icon: <UnorderedListOutlined /> },
];

const STATION_NAME = 'Kepler Station Alpha';

export function StationLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = NAV_ITEMS.find((item) =>
    item.key === '/' ? location.pathname === '/' : location.pathname.startsWith(item.key),
  )?.key ?? '/';

  return (
    <Layout className={styles['station-layout']}>
      <Sider
        className={styles['station-layout__sidebar']}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        collapsedWidth={64}
      >
        <div className={styles['station-layout__logo']}>
          {!collapsed && (
            <span className={styles['station-layout__logo-text']}>SSM</span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={NAV_ITEMS}
          onClick={({ key }) => navigate(key)}
          aria-label="Station navigation"
        />
      </Sider>

      <Layout>
        <Header className={styles['station-layout__topbar']}>
          <span className={styles['station-layout__station-name']}>{STATION_NAME}</span>
          <div className={styles['station-layout__scanline']} aria-hidden="true" />
        </Header>

        <Content className={styles['station-layout__content']}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
