import * as migration_20261028_154742_initial from './20261028_154742_initial';
import * as migration_20261028_164410_pricing from './20261028_164410_pricing';

export const migrations = [
  {
    up: migration_20261028_154742_initial.up,
    down: migration_20261028_154742_initial.down,
    name: '20261028_154742_initial',
  },
  {
    up: migration_20261028_164410_pricing.up,
    down: migration_20261028_164410_pricing.down,
    name: '20261028_164410_pricing'
  },
];
