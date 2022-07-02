import crypto from 'crypto';
import fs from 'fs';
import { parse, resolve } from 'path';
import { copyFile } from 'node:fs/promises';
import { curry, __ } from 'ramda';

/**
 * Hash content to string.
 *
 * @param {string} filename Absolute to hash.
 * @param {string} algo ALgorithm to hash.
 * @returns {string} Hash result.
 */
const hashFile = (filename, algo = 'sha1') => {
  return new Promise((resolve, reject) => {
    const chksum = crypto.createHash(algo);
    const s = fs.ReadStream(filename);

    s.on('error', function (err) {
      reject(err);
    });

    s.on('data', function (d) {
      chksum.update(d);
    });

    s.on('end', function () {
      resolve(chksum.digest('hex'));
    });
  });
};

/**
 * Compare two file.
 *
 * @param {string} origin  Base file to compare.
 * @param {*} target Target file to compared. May be string or file data object.
 * @returns {boolean} Result of compare.
 */
const compareFile = async (origin, target) => {
  const hash1 = await hashFile(origin);
  const hash2 = await hashFile(typeof target === 'object' && target instanceof FileData ? target.getLocation() : target);

  return hash1 === hash2;
};

/**
 * Create a file data object.
 *
 * @param {string} relativePath Relative of the file.
 * @returns {FileData} File data object.
 */
function FileData (relativePath) {
  if (!new.target) { return new FileData(...arguments); }

  // private variables
  const absolutePath = resolve(relativePath);
  const info = parse(absolutePath);

  // public properties
  this.filename = info.base;

  // public methods
  this.copyTo = curry(copyFile)(absolutePath, __, 0);
  this.compareWith = curry(compareFile)(absolutePath);
  this.getLocation = () => absolutePath;
}

FileData.prototype.toString = function () {
  return `[data "${this.filename}"]`;
};

export default FileData;
