import * as migration_20261023_092515_initial from './20261023_092515_initial';
import * as migration_20261023_093816_media_storage_fields from './20261023_093816_media_storage_fields';
import * as migration_20261023_095900_content_model from './20261023_095900_content_model';
import * as migration_20261026_083348_optional_header_button from './20261026_083348_optional_header_button';

export const migrations = [
  {
    up: migration_20261023_092515_initial.up,
    down: migration_20261023_092515_initial.down,
    name: '20261023_092515_initial',
  },
  {
    up: migration_20261023_093816_media_storage_fields.up,
    down: migration_20261023_093816_media_storage_fields.down,
    name: '20261023_093816_media_storage_fields',
  },
  {
    up: migration_20261023_095900_content_model.up,
    down: migration_20261023_095900_content_model.down,
    name: '20261023_095900_content_model',
  },
  {
    up: migration_20261026_083348_optional_header_button.up,
    down: migration_20261026_083348_optional_header_button.down,
    name: '20261026_083348_optional_header_button'
  },
];
