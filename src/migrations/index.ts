import * as migration_20260918_135130_init_schema from './20260918_135130_init_schema';

export const migrations = [
  {
    up: migration_20260918_135130_init_schema.up,
    down: migration_20260918_135130_init_schema.down,
    name: '20260918_135130_init_schema'
  },
];
