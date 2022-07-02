import { customAlphabet } from 'nanoid';

import { ID_PREFIX, ID_SIZE, ID_TIME_SIZE, ID_ALPHABET } from './constants.js';

const nanoid = customAlphabet(ID_ALPHABET, ID_SIZE - ID_TIME_SIZE - ID_PREFIX.length);

/**
 * Add prefix to origin text.
 *
 * @param {string} origin Origin string. Required.
 * @param {number} max Max length of needed string. Required.
 * @param {string} character Character to add. Required.
 * @returns {string} Transformed String.
 */
const align = (origin, max, character) => {
  origin = origin.substring(Math.max(origin.length - max, 0));
  while (origin.length < max) { origin = character + origin; }
  return origin;
};

/**
 * Get unique now time.
 *
 * @returns {number} Now in milisecond.
 */
const now = () => {
  const time = Date.now();
  const last = now.last || time;
  now.last = time > last ? time : last + 1;
  return now.last;
};

/**
 * Generate unique id.
 *
 * @returns {string} Id generated
 */
const generateId = () => {
  return ID_PREFIX + align(now().toString(36), ID_TIME_SIZE, '0') + nanoid();
};
export default generateId;
