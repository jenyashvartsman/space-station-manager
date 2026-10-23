import { Routes, Route } from 'react-router-dom';
import { StationLayout } from '../shared/components/StationLayout/StationLayout';
import { StationDashboard } from '../pages/StationDashboard/StationDashboard';
import { CrewRoster } from '../pages/CrewRoster/CrewRoster';
import { ModuleManagement } from '../pages/ModuleManagement/ModuleManagement';
import { MissionControl } from '../pages/MissionControl/MissionControl';
import { ResourcePanel } from '../pages/ResourcePanel/ResourcePanel';
import { EventLog } from '../pages/EventLog/EventLog';
import { Landing } from '../pages/Landing/Landing';

export function AppRouter() {
  return (
    <Routes>
      <Route path="landing" element={<Landing />} />
      <Route element={<StationLayout />}>
        <Route index element={<StationDashboard />} />
        <Route path="crew" element={<CrewRoster />} />
        <Route path="modules" element={<ModuleManagement />} />
        <Route path="missions" element={<MissionControl />} />
        <Route path="resources" element={<ResourcePanel />} />
        <Route path="events" element={<EventLog />} />
      </Route>
    </Routes>
  );
}
