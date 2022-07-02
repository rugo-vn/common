/* eslint-disable */

import { expect } from 'chai';

import { BaseComposer, KoaComposer, wrapComposer } from "../src/composer.js";

describe('Composer test', () => {
  it('should be test default', async () => {
    const args = await BaseComposer.argsParser([1, 2, 3]);
    expect(args).to.have.ordered.members([1, 2, 3]);

    const result = await BaseComposer.returnParser(1);
    expect(result).to.be.eq(1);
  });

  it('should be test koa', async () => {
    const context = { params: { id: 1 }};

    const args = await KoaComposer.argsParser(['.params.id', 2, '3'])([context]);
    expect(args).to.have.ordered.members([1, 2, '3']);

    const result = await KoaComposer.returnParser({ status: 200, data: 'ok' })([context]);

    expect(result).to.deep.equal({ status: 200, data: 'ok' });
    expect(context).to.has.property('status', 200);
    expect(context).to.has.property('body');
    expect(context.body).to.has.property('status', 'success');
    expect(context.body).to.has.property('data', 'ok');

    const result2 = await KoaComposer.returnParser({ status: 400, data: 'ok' })([context]);
    expect(result2).to.deep.equal({ status: 400, data: 'ok' });
    expect(context).to.has.property('status', 400);
    expect(context).to.has.property('body');
    expect(context.body).to.has.property('status', 'error');
    expect(context.body).to.has.property('data', 'ok');
  });

  it('should be wrap composer', async () => {
    const fn = wrapComposer(() => { return 123 });
    const res = await fn(BaseComposer)(1, 2, 3)(4, 5);
    expect(res).to.be.eq(123);

    const fn2 = wrapComposer(() => { return null; });
    const context = {};
    const res2 = await fn2(KoaComposer)(1, 2, 3)(context, () => { context.valid = true });
    expect(res2).to.be.eq(null);
    expect(context).to.has.property('valid', true);

    const res3 = await fn2(KoaComposer)(1, 2, 3)(context);
    expect(res3).to.be.eq(null);
  });
});
