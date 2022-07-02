/* eslint-disable */

import { expect } from 'chai';
import { EmptyCollection, BaseCollection } from '../src/collection.js';

import { DEFAULT_LIMIT } from '../src/constants.js';

const SAMPLE_DOCUMENT = { foo: 'bar' };
const SAMPLE_ID = 123;
const SAMPLE_MAX = 15;

describe('Collection test', () => {
  let collection;

  beforeEach(async () => {
    const data = [];
    collection = {};

    for (let key in BaseCollection){
      if (key === 'id'){
        collection[key] = BaseCollection[key];
        continue;
      }

      collection[key] = BaseCollection[key](data);
    }
  });

  it('should run empty', async () => {
    for (let key in EmptyCollection)
      EmptyCollection[key]();
  });

  it('should create a document', async () => {
    const doc = await collection.create(SAMPLE_DOCUMENT);
    
    expect(doc).to.has.property('_id');

    for (let key in SAMPLE_DOCUMENT)
      expect(doc).to.has.property(key, SAMPLE_DOCUMENT[key]);
  });

  it('should create a document with existed id', async () => {
    const doc = await collection.create({
      _id: SAMPLE_ID,
      ...SAMPLE_DOCUMENT
    });
    
    expect(doc).to.has.property('_id', SAMPLE_ID);

    for (let key in SAMPLE_DOCUMENT)
      expect(doc).to.has.property(key, SAMPLE_DOCUMENT[key]);
  });

  it('should get a created document', async () => {
    const doc = await collection.create(SAMPLE_DOCUMENT);
    const doc2 = collection.get(doc._id);
    
    expect(doc2).to.has.property('_id');

    for (let key in SAMPLE_DOCUMENT)
      expect(doc2).to.has.property(key, SAMPLE_DOCUMENT[key]);

    // no existed get
    const doc3 = collection.get('noexisted');
    expect(doc3).to.be.eq(null);
  });

  it('should create many document and count query', async () => {
    for (let i = 0; i < SAMPLE_MAX; i++){
      await collection.create({
        ...SAMPLE_DOCUMENT,
        gender: i % 2 === 0 ? 'male' : 'female'
      });
    }

    const no = collection.count({ gender: 'male' });
    expect(no).to.be.eq(Math.round(SAMPLE_MAX/2));
  });

  it('should list document by query and controls', async () => {
    for (let i = 0; i < SAMPLE_MAX; i++){
      await collection.create({
        ...SAMPLE_DOCUMENT,
        gender: i % 2 === 0 ? 'male' : 'female'
      });
    }

    // default list
    const result = collection.list({});
    
    expect(result).to.has.property('total', SAMPLE_MAX);
    expect(result).to.has.property('skip', 0);
    expect(result).to.has.property('limit', DEFAULT_LIMIT);
    expect(result).to.has.property('data');
    expect(result.data.length).to.be.eq(DEFAULT_LIMIT);

    // list with query
    const result2 = collection.list({ gender: 'female' });

    expect(result2).to.has.property('total', Math.floor(SAMPLE_MAX/2));
    expect(result2).to.has.property('skip', 0);
    expect(result2).to.has.property('limit', DEFAULT_LIMIT);
    expect(result2).to.has.property('data');
    expect(result2.data.length).to.be.eq(Math.floor(SAMPLE_MAX/2));

    for (let doc of result2.data)
      expect(doc).to.has.property('gender', 'female');

    // list with controls
    const result3 = collection.list({}, { $sort: { gender: 1, _id: -1 }, $limit: 5, $skip: SAMPLE_MAX - 6 });

    expect(result3).to.has.property('total', 15);
    expect(result3).to.has.property('skip', SAMPLE_MAX - 6);
    expect(result3).to.has.property('limit', 5);
    expect(result3).to.has.property('data');
    expect(result3.data.length).to.be.eq(5);

    for (let doc of result3.data)
      expect(doc).to.has.property('gender', 'male');
  });

  it('should patch document', async () => {
    const doc = await collection.create(SAMPLE_DOCUMENT);
    await collection.create(SAMPLE_DOCUMENT);
    
    // simple change
    const no = await collection.patch({ _id: doc._id }, { $set: { foo: '123', age: 10, count: 1 }});
    const doc3 = collection.get(doc._id);

    expect(no).to.be.eq(1);
    expect(doc3).to.has.property('foo', '123');
    expect(doc3).to.has.property('age', 10);
    expect(doc3).to.has.property('count', 1);

    // inc dec
    const no2 = await collection.patch({ foo: '123' }, { $set: { foo: 'xyz' }, $inc: { count: 1, age: -2 }});
    const doc4 = collection.get(doc._id);

    expect(no2).to.be.eq(1);
    expect(doc4).to.has.property('foo', 'xyz');
    expect(doc4).to.has.property('age', 8);
    expect(doc4).to.has.property('count', 2);
  });

  it('should remove documents', async () => {
    for (let i = 0; i < SAMPLE_MAX; i++){
      await collection.create({
        ...SAMPLE_DOCUMENT,
        gender: i % 2 === 0 ? 'male' : 'female'
      });
    }

    const no = await collection.remove({ gender: 'male' });
    const result = collection.list({});

    expect(no).to.be.eq(Math.round(SAMPLE_MAX/2));
    for (let doc of result.data)
      expect(doc).to.has.property('gender', 'female');
  });
});