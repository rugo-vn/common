/* eslint-disable */

import { expect } from 'chai';
import BasePlugin from '../src/plugin.js';

describe('Plugin test', () => {
  it('should create a plugin', async () => {
    const plugin = {
      ...BasePlugin
    };

    const plugin2 = {
      ...BasePlugin
    }

    for (let key in BasePlugin)
      expect(plugin).to.has.property(key);

    expect(plugin).to.be.not.eq(plugin2);
    expect(plugin.name).to.be.not.eq(plugin2.name);
  });

  it('should run a plugin', async () => {
    const plugin = {
      ...BasePlugin
    };

    await plugin.start();
    await plugin.close();
  });
});