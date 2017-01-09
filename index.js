'use strict';

import Makeup from './component/makeup.js';
import getComponents from './tree.js';
import ReactDOM from 'react-dom';
import React from 'react';

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <Makeup components={getComponents()} />,
  document.getElementById('root')
);
