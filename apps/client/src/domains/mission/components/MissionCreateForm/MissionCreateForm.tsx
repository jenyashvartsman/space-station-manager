import { useState } from 'react';
import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { missionService } from '../../services/mission.service';
import { useMissionStore } from '../../store/useMissionStore';
import styles from './MissionCreateForm.module.scss';
import type { CreateMissionBody } from '../../types/mission.types';

interface MissionCreateFormProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  title: string;
  description?: string;
  durationMinutes: number;
  oxygen?: number;
  power?: number;
  food?: number;
  fuel?: number;
  water?: number;
}

const RESOURCE_KEYS = ['oxygen', 'power', 'food', 'fuel', 'water'] as const;

export function MissionCreateForm({ open, onClose }: MissionCreateFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const addMission = useMissionStore((s) => s.addMission);

  async function handleSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const reward: CreateMissionBody['reward'] = {};
      for (const key of RESOURCE_KEYS) {
        const val = values[key];
        if (val !== undefined && val !== null) {
          reward[key] = val;
        }
      }

      const body: CreateMissionBody = {
        title: values.title,
        description: values.description,
        durationSeconds: values.durationMinutes * 60,
        reward: Object.keys(reward).length > 0 ? reward : undefined,
      };

      const mission = await missionService.createMission(body);
      addMission(mission);
      form.resetFields();
      onClose();
    } catch {
      // error is non-fatal; form stays open
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    form.resetFields();
    onClose();
  }

  return (
    <Modal
      title="NEW MISSION"
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles['mission-create-form']}
        data-testid="mission-create-form"
      >
        <Form.Item
          name="title"
          label="Mission Title"
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input placeholder="e.g. Asteroid Survey" data-testid="mission-title-input" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea
            rows={2}
            placeholder="Optional mission briefing"
            data-testid="mission-description-input"
          />
        </Form.Item>

        <Form.Item
          name="durationMinutes"
          label="Duration (minutes)"
          rules={[
            { required: true, message: 'Duration is required' },
            { type: 'number', min: 1, message: 'Minimum 1 minute' },
          ]}
        >
          <InputNumber
            min={1}
            placeholder="5"
            style={{ width: '100%' }}
            data-testid="mission-duration-input"
          />
        </Form.Item>

        <div className={styles['mission-create-form__rewards-label']}>Rewards (optional)</div>

        <div className={styles['mission-create-form__rewards']}>
          {RESOURCE_KEYS.map((resource) => (
            <Form.Item
              key={resource}
              name={resource}
              label={resource.charAt(0).toUpperCase() + resource.slice(1)}
            >
              <InputNumber
                placeholder="0"
                style={{ width: '100%' }}
                data-testid={`mission-reward-${resource}`}
              />
            </Form.Item>
          ))}
        </div>

        <div className={styles['mission-create-form__actions']}>
          <Button onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            data-testid="mission-submit-button"
          >
            Launch Mission
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
