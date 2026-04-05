// Re-exports the central axios instance.
// Some components import from 'api/axios', others from 'utils/api'.
// Both resolve to the same configured instance.
export { default } from '../utils/api';
