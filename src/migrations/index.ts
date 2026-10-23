import * as migration_20261023_092515_initial from './20261023_092515_initial';
import * as migration_20261023_093816_media_storage_fields from './20261023_093816_media_storage_fields';

export const migrations = [
  {
    up: migration_20261023_092515_initial.up,
    down: migration_20261023_092515_initial.down,
    name: '20261023_092515_initial',
  },
  {
    up: migration_20261023_093816_media_storage_fields.up,
    down: migration_20261023_093816_media_storage_fields.down,
    name: '20261023_093816_media_storage_fields'
  },
];
