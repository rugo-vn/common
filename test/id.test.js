/* eslint-disable */

import { expect } from 'chai';

import { ID_SIZE } from '../src/constants.js';
import generateId from "../src/id.js";

describe('Id test', () => {
  it('should generate id', async () => {
    const id = generateId();
    const anotherId = generateId();

    expect(id).to.has.property('length', ID_SIZE);
    expect(id).to.be.not.eq(anotherId);
    expect(id < anotherId).to.be.eq(true);
  });
});