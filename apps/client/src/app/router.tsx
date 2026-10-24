import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { StationLayout } from '../shared/components/StationLayout/StationLayout';
import styles from './router.module.scss';

const Landing          = lazy(() => import('../pages/Landing/Landing').then(m => ({ default: m.Landing })));
const StationDashboard = lazy(() => import('../pages/StationDashboard/StationDashboard').then(m => ({ default: m.StationDashboard })));
const CrewRoster       = lazy(() => import('../pages/CrewRoster/CrewRoster').then(m => ({ default: m.CrewRoster })));
const ModuleManagement = lazy(() => import('../pages/ModuleManagement/ModuleManagement').then(m => ({ default: m.ModuleManagement })));
const ResourcePanel    = lazy(() => import('../pages/ResourcePanel/ResourcePanel').then(m => ({ default: m.ResourcePanel })));
const MissionControl   = lazy(() => import('../pages/MissionControl/MissionControl').then(m => ({ default: m.MissionControl })));
const EventLog         = lazy(() => import('../pages/EventLog/EventLog').then(m => ({ default: m.EventLog })));

export function AppRouter() {
  const location = useLocation();

  return (
    <Suspense fallback={<div className={styles['route-loader']}>Loading…</div>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route element={<StationLayout />}>
            <Route path="station" element={<StationDashboard />} />
            <Route path="crew" element={<CrewRoster />} />
            <Route path="modules" element={<ModuleManagement />} />
            <Route path="modules/:id" element={<ModuleManagement />} />
            <Route path="missions" element={<MissionControl />} />
            <Route path="resources" element={<ResourcePanel />} />
            <Route path="events" element={<EventLog />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
