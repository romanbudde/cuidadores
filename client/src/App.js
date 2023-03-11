import React, { Fragment } from "react";

import './App.css';

// components
import InputUser from './components/InputUser';
import ListUsers from './components/ListUsers';

const App = () => {
  return (
    <Fragment>
        <InputUser />
        <ListUsers />
    </Fragment>
  );
}

export default App;
