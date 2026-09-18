import { authReady } from '../../../auth';
export function load() { return { ready: authReady() }; }
