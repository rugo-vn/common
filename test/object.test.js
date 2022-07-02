/* eslint-disable */

import { expect } from 'chai';

import objectPath from "../src/object.js";

describe('Id test', () => {
  it('should generate id', async () => {
    const a = { b: 'c' };
    expect(objectPath.get(a, 'b')).to.be.eq('c');

    const fn = function(){};
    fn.prototype.b = 'c';

    const a1 = new fn();
    expect(objectPath.get(a1, 'b')).to.be.eq('c');
    expect(objectPath.get(a1, 'c')).to.be.eq(undefined);
  });
});