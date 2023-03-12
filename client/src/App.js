import React, { Fragment } from "react";

import './App.css';

// components
import AddUser from './components/AddUser';
import ListUsers from './components/ListUsers';

const App = () => {
  return (
    <Fragment>
        {/* <AddUser /> */}
        <ListUsers />
    </Fragment>
  );
}

export default App;
