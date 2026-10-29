import { Select, notification } from 'antd';
import { crewService } from '../../services/crew.service';
import { useCrewStore } from '../../store/useCrewStore';
import { moduleService } from '../../../module/services/module.service';
import { useModuleStore } from '../../../module/store/useModuleStore';

interface CrewAssignmentSelectProps {
  crewId: string;
  assignedModuleId: string | null;
}

export function CrewAssignmentSelect({ crewId, assignedModuleId }: CrewAssignmentSelectProps) {
  const modules = useModuleStore((s) => s.modules);
  const setModules = useModuleStore((s) => s.setModules);
  const updateCrewMember = useCrewStore((s) => s.updateCrewMember);

  const options = modules.map((m) => ({ value: m.id, label: m.name }));

  async function handleChange(value: string | undefined) {
    try {
      const updated = await crewService.updateCrew(crewId, {
        assignedModuleId: value ?? null,
      });
      updateCrewMember(updated);

      if (value) {
        const freshModules = await moduleService.getModules();
        setModules(freshModules);
        const assignedModule = freshModules.find((m) => m.id === value);
        if (updated.role.toLowerCase() === 'engineer' && assignedModule?.repairing) {
          notification.success({ message: 'Engineer deployed — repair initiated', duration: 2 });
        }
        if (updated.role.toLowerCase() === 'medic' && assignedModule?.type === 'medical' && assignedModule?.status === 'nominal') {
          notification.success({ message: 'Medic deployed — healing bay active', duration: 2 });
        }
      }
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
