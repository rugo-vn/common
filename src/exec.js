import util from 'node:util';
import { exec as _exec } from 'node:child_process';

export default util.promisify(_exec);
