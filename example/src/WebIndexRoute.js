import path from 'path';
import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';

import { rootdir } from '../config';

const getHref = (pathname) => {
  // /web
  let name = pathname.slice(rootdir.length).split('/')[0];
  // /web.html
  name = name.split('.')[0];
  const ext = path.extname(pathname);
  return `${rootdir}${name}/peanut${ext}`;
};

const WebIndexRoute = (props) => (
  <div>
    <p><a href={'https://github.com/wenbing/webpack-bbq'}>webpack-bbq</a></p>
    <pre>props.location: {JSON.stringify(props.location, (key, value) => {
      if (key === 'key') return undefined;
      return value;
    }, 4)}</pre>
    <p><Link to={`${getHref(props.location.pathname)}`}>PeaNut</Link></p>
    {props.children}
  </div>
);

WebIndexRoute.propTypes = {
  location: PropTypes.object,
  children: PropTypes.element,
};

export default WebIndexRoute;
