const hash = require('./hash');
const { rootdir } = require('../config');

const getChunkNames = (location) => {
  const route = hash.get(location.pathname);
  const chunkNames = [];
  if (route.src === `${rootdir}/web/*` || route.src === `${rootdir}web.html`) {
    chunkNames.push('web');
  }
  if (route.src === `${rootdir}/m/*` || route.src === `${rootdir}m.html`) {
    chunkNames.push('m');
  }
  if (route.src === `${rootdir}/hare/*` || route.src === `${rootdir}hare.html`) {
    chunkNames.push('hare');
  }
  const peanut = location.pathname.slice(rootdir.length).split('/')[1];
  if (peanut === 'peanut' || peanut === 'peanut.html') {
    chunkNames.push('peanut');
  }
  return chunkNames;
}

export default getChunkNames;
