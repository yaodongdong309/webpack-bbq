const hash = require('./hash');

const getChunkNames = (location) => {
  const route = hash.get(location.pathname);
  const chunkNames = [];
  if (route.src === '/web/*' || route.src === '/web.html') {
    chunkNames.push('web');
  }
  if (route.src === '/m/*' || route.src === '/m.html') {
    chunkNames.push('m');
  }
  if (route.src === '/hare/*' || route.src === '/hare.html') {
    chunkNames.push('hare');
  }
  const peanut = location.pathname.split('/')[2];
  if (peanut === 'peanut' || peanut === 'peanut.html') {
    chunkNames.push('peanut');
  }
  return chunkNames;
}

export default getChunkNames;
