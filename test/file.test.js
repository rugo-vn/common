/* eslint-disable */

import fs from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { expect } from 'chai';
import rimraf from 'rimraf';
import FileLocation from '../src/file.js';
import { assert } from 'console';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('File Data test', () => {
  const root = join(__dirname, '.cache');

  beforeEach(async () => {
    if (fs.existsSync(root)) { rimraf.sync(root); }

    fs.mkdirSync(root, { recursive: true });
  });

  afterEach(async () => {
    if (fs.existsSync(root)) { rimraf.sync(root); }
  });

  it('should be create file data', async () => {
    const file = FileLocation('./package.json');

    expect(file.getLocation()).to.be.eq(resolve('./package.json'));

    expect(typeof file).to.be.eq('object');

    expect(file).to.has.property('filename', 'package.json');
    expect(file).to.has.property('copyTo');
    expect(file).to.has.property('compareWith');
    expect(file).to.has.property('getLocation');

    expect(file.toString()).to.be.eq('[data "package.json"]');
  });

  it('should be copy file data', async () => {
    const file = FileLocation('./package.json');

    const dst = join(root, 'demo.package.json');
    await file.copyTo(dst);

    expect(fs.existsSync(dst)).to.be.eq(true);
    expect(await file.compareWith(dst)).to.be.eq(true);
    expect(await file.compareWith(resolve('./README.md'))).to.be.eq(false);
  });

  it('should be wrong compare', async () => {
    const file = FileLocation('./package.json');

    try {
      await file.compareWith('./noexisted.json');
      return assert.fail();
    } catch (err) {
      // pass
    }
  });
});
