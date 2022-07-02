import { MAX_PRIORITY } from './constants.js';
import generateId from './id.js';

/**
 * @global
 * @typedef {object} Plugin
 * @property {string} name name of plugin.
 * @property {Array.<string>} depends depend registers, the context should have there before run this plugin.
 * @property {number} priority same depend have lower priority is run first.
 * @property {Function} start Start function.
 * @property {Function} close Close function.
 */
const BasePlugin = {
  get name () {
    return generateId();
  },
  depends: [],
  priority: MAX_PRIORITY,
  async start (/* context */) { },
  async close (/* context */) { }
};
export default BasePlugin;
