import * as migration_20261023_092515_initial from './20261023_092515_initial';

export const migrations = [
  {
    up: migration_20261023_092515_initial.up,
    down: migration_20261023_092515_initial.down,
    name: '20261023_092515_initial'
  },
];
