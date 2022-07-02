import objectPath from './object.js';
import { curry, curryN } from 'ramda';

/**
 * @global
 * @typedef {object} Composer
 * @property {Function} argsParser Argument parser.
 * @property {Function} returnParser Return parser.
 */
export const BaseComposer = {
  argsParser: validateArgs => validateArgs,
  returnParser: result => result
};

export const KoaComposer = {
  ...BaseComposer,

  argsParser: curry((validateArgs, { 0: context }) =>
    validateArgs.map(
      arg => typeof arg === 'string' && arg[0] === '.' ? objectPath.get(context, arg.substring(1)) : arg
    )
  ),

  returnParser: curryN(2, async (result, { 0: context, 1: next = () => {} }) => {
    if (!result) {
      await next();
      return result;
    }

    const { status, data } = result;

    context.status = status;
    context.body = {
      status: status === 200 ? 'success' : 'error',
      data: null
    };

    if (data) { context.body.data = data; }

    return result;
  })
};

/**
 * Wrap function with composer to prepare arguments and bind result.
 *
 * @param {Function} fn Function need to wrap.
 * @returns {object} Returned object.
 */
export const wrapComposer = fn => composer => (...validateArgs) => async (...targetArgs) => {
  const args = await composer.argsParser(validateArgs, targetArgs);

  const result = await fn(...args);

  return await composer.returnParser(result, targetArgs);
};
