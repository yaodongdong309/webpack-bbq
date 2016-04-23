import React, { PropTypes } from 'react';

import styles from './index.css';

const WebContaner = (props) => (
  <div className={styles.js}>
    <div className={styles.css}>Web Contaner</div>
    {props.children}
  </div>
);

WebContaner.propTypes = {
  children: PropTypes.element,
};

export default WebContaner;
