export const DEFAULT_LIMIT = 10;
export const PASSWORD_SALT = 10;

const MAX_TIME = 99999999999999;
export const ID_TIME_SIZE = MAX_TIME.toString(36).length;
export const ID_PREFIX = 'r';
export const ID_SIZE = 128 / 8;
export const ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

export const MAX_PRIORITY = 9999;

/**
 * Document structure.
 *
 * @global
 * @typedef {object} Document
 * @property {*} _id Id of the document.
 */
