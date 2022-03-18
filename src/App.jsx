import React, { Fragment , useState } from "react";
import Test from "./test";
import Task2 from "./components/Task2";
const App = () => {
  const mapConfig = {
    lat: 22,
    lng: -72,
    zoom: 6
  };

  const [edit , setEdit] = useState(false)

  return (
    <Fragment>
        <div id="map-wrapper">
            <Test />
            <Task2  />
        </div>
    </Fragment>
  );
};

export default App;
