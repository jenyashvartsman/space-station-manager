import { app } from './app.js';
import { config } from './config.js';
import { startSimulationTick } from './simulation/tick.js';

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`); // eslint-disable-line no-console
  startSimulationTick();
});
