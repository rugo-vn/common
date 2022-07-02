import { curry, find, propEq, whereEq, count, keys, compose, descend, prop, ascend, sortWith, drop, take, pipe, curryN, filter, map, forEach, length } from 'ramda';
import { DEFAULT_LIMIT } from './constants.js';
import generateId from './id.js';

/**
 * Generate id or check.
 *
 * @param {*} id Id to check. Optional.
 * @returns {*} Checked Id or a new ID.
 */
const doId = id => id || generateId();

/**
 * Create a new document
 *
 * @async
 * @param {Array} data Data object. Required.
 * @param {Document} doc A document to be created. Required.
 * @returns {Document} A created document.
 */
const doCreate = async (data, doc) => {
  const newDoc = {
    // basic info
    _id: doId(),

    // document
    ...doc
  };

  data.push(newDoc);
  return newDoc;
};

/**
 * Get a document by id.
 *
 * @param {Array} data data array, for read and write. Required.
 * @param {*} id Id of document need to find.
 * @returns {Document} Document needed.
 */
const doGet = (data, id) => {
  return find(propEq('_id', id))(data) || null;
};

/**
 * Count document by query.
 *
 * @param {Array} data data array, for read and write. Required.
 * @param {object} query Match exact query object.
 * @returns {number} Count.
 */
const doCount = (data, query) => {
  return count(whereEq(query))(data);
};

/**
 * List documents.
 *
 * @param {Array} data data array, for read and write. Required.
 * @param {object} query Match exact query object.
 * @param {object} controls Control list result, maybe contains: $limit, $sort, $skip
 * @returns {object} List result, contains: total (total of query result), skip (no skip documents), limit (no limit documents), data (list document).
 */
const doList = (data, query, controls = {}) => {
  const pipeline = [filter(whereEq(query))];

  if (controls.$sort) {
    pipeline.push(
      sortWith(
        compose(
          map(k => controls.$sort[k] === -1 ? descend(prop(k)) : ascend(prop(k))),
          keys
        )(controls.$sort)
      )
    );
  }

  if (controls.$skip) { pipeline.push(drop(controls.$skip)); }

  const limit = typeof controls.$limit === 'number' ? controls.$limit : DEFAULT_LIMIT;
  if (limit !== -1) { pipeline.push(take(limit)); }

  return {
    total: doCount(data, query),
    skip: controls.$skip || 0,
    limit,
    data: pipe(...pipeline)(data)
  };
};

/**
 * Patch documents.
 *
 * @async
 * @param {Array} data data array, for read and write. Required.
 * @param {object} query Match exact query object.
 * @param {object} controls Control list result, maybe contains: $set, $inc.
 * @returns {number} No of changed documents.
 */
const doPatch = async (data, query, controls = {}) => {
  const pipeline = [filter(whereEq(query))];

  if (controls.$set) {
    pipeline.push(
      forEach(doc => {
        for (const key in controls.$set) {
          doc[key] = controls.$set[key];
        }
      })
    );
  }

  if (controls.$inc) {
    pipeline.push(
      forEach(doc => {
        for (const key in controls.$inc) {
          if (typeof doc[key] === 'number') { doc[key] += controls.$inc[key]; }
        }
      })
    );
  }

  if (controls.$unset) {
    pipeline.push(
      forEach(doc => {
        for (const key in controls.$unset) {
          delete doc[key];
        }
      })
    );
  }

  pipeline.push(length);
  const result = pipe(...pipeline)(data);

  return result;
};

/**
 * Remove documents
 *
 * @param {Array} data data array, for read and write. Required.
 * @param {object} query Match exact query object.
 * @returns {number} No removed document.
 */
const doRemove = async (data, query) => {
  const pred = whereEq(query);

  let index = 0;
  let result = 0;
  while (index < data.length) {
    if (pred(data[index])) {
      data.splice(index, 1);
      result++;
      continue;
    }

    index++;
  }

  return result;
};

/**
 * Collection structure.
 *
 * @global
 * @typedef {object} Collection
 * @property {Function} id check or get id
 * @property {Function} get Get document by id.
 * @property {Function} count Count no of document returned.
 * @property {Function} list List document by query.
 * @property {Function} create Create a new document.
 * @property {Function} patch Update existed documents.
 * @property {Function} remove Remove documents.
 * @property {Function} import Import documents.
 * @property {Function} export Export documents.
 */
export const EmptyCollection = ({
  id () {},
  get () {},
  count () {},
  list () {},
  create () {},
  patch () {},
  remove () {},
  import () {},
  export () {}
});

export const BaseCollection = ({
  ...EmptyCollection,

  id: doId,
  create: curry(doCreate),
  get: curry(doGet),
  count: curry(doCount),
  list: curryN(2, doList),
  patch: curryN(2, doPatch),
  remove: curry(doRemove)
});
