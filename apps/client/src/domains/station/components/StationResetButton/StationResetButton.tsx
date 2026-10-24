import { useState } from 'react';
import { Modal, message } from 'antd';
import { stationService } from '../../services/station.service';
import styles from './StationResetButton.module.scss';

export function StationResetButton() {
  const [resetting, setResetting] = useState(false);

  function handleResetClick() {
    Modal.confirm({
      title: 'RESET STATION?',
      content: 'This will wipe all data and restore factory defaults.',
      okText: 'Confirm Reset',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        setResetting(true);
        try {
          await stationService.resetStation();
          window.location.reload();
        } catch {
          setResetting(false);
          message.error('Station reset failed. Check server logs.');
        }
      },
    });
  }

  return (
    <div className={styles['station-reset-button']}>
      <button
        data-testid="station-reset-button"
        className={styles['station-reset-button__trigger']}
        onClick={handleResetClick}
        disabled={resetting}
        aria-label="Reset station to factory defaults"
      >
        {resetting ? (
          <span className={styles['station-reset-button__spinner']} aria-hidden="true" />
        ) : null}
        {resetting ? 'RESETTING…' : 'RESET STATION'}
      </button>
    </div>
  );
}
