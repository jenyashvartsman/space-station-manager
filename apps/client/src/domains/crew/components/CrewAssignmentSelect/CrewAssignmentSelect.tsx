import { Select } from 'antd';
import { crewService } from '../../services/crew.service';
import { useCrewStore } from '../../store/useCrewStore';
import { useModuleStore } from '../../../module/store/useModuleStore';

interface CrewAssignmentSelectProps {
  crewId: string;
  assignedModuleId: string | null;
}

export function CrewAssignmentSelect({ crewId, assignedModuleId }: CrewAssignmentSelectProps) {
  const modules = useModuleStore((s) => s.modules);
  const updateCrewMember = useCrewStore((s) => s.updateCrewMember);

  const options = modules.map((m) => ({ value: m.id, label: m.name }));

  async function handleChange(value: string | undefined) {
    try {
      const updated = await crewService.updateCrew(crewId, {
        assignedModuleId: value ?? null,
      });
      updateCrewMember(updated);
    } catch {
      // assignment errors are surfaced via the UI staying unchanged
    }
  }

  return (
    <Select
      allowClear
      placeholder="Unassigned"
      value={assignedModuleId ?? undefined}
      options={options}
      onChange={handleChange}
      size="small"
      style={{ width: '100%' }}
      aria-label="Change module assignment"
    />
  );
}
