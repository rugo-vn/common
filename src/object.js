import originObjectPath from 'object-path';
import { path } from 'ramda';

export default {
  get (obj, p) {
    const rel = originObjectPath.get(obj, p);

    if (rel) { return rel; }

    const rel2 = path(p.split('.'), obj);
    return rel2 || rel;
  },
  set: originObjectPath.set
};
