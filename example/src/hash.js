import httpHash from 'http-hash';
import { rootdir } from '../config';

const hash = httpHash();

const web = (initialState) => {
  require.ensure([], () => require('./web')(initialState), 'web');
};
hash.set(`${rootdir}web/*`, web);
hash.set(`${rootdir}web.html`, web);

const m = (initialState) => {
  require.ensure([], () => {
    require('basscss/css/basscss.css');
    require('./m')(initialState);
  }, 'm');
};
hash.set(`${rootdir}m/*`, m);
hash.set(`${rootdir}m.html`, m);

const hare = (initialState) => {
  require.ensure([], () => require('./hare')(initialState), 'hare');
};
hash.set(`${rootdir}hare/*`, hare);
hash.set(`${rootdir}hare.html`, hare);

export default hash;
