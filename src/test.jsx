import React, { Component } from "react";
import { Map, TileLayer, Circle, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import FullscreenControl from "react-leaflet-fullscreen";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png"
});

//

let polyline;

export default class test extends Component {

  _onEdited = e => {
    let numEdited = 0;
    e.layers.eachLayer(layer => {
      numEdited += 1;
    });
    console.log(`_onEdited: edited ${numEdited} layers`, e);

    this._onChange();
  };

  _onCreated = e => {
    let type = e.layerType;
    let layer = e.layer;
    if (type === "marker") {
      // Do marker specific actions
      console.log("_onCreated: marker created", e);
    } else {
      console.log("_onCreated: something else created:", type, e);
    }
    // Do whatever else you need to. (save to db; etc)

    this._onChange();
  };

  _onDeleted = e => {
    let numDeleted = 0;
    e.layers.eachLayer(layer => {
      numDeleted += 1;
    });
    console.log(`onDeleted: removed ${numDeleted} layers`, e);

    this._onChange();
  };

  _onMounted = drawControl => {
    console.log("_onMounted", drawControl);
  };

  _onEditStart = e => {
    console.log("_onEditStart", e);
  };

  _onEditStop = e => {
    console.log("_onEditStop", e);
  };

  _onDeleteStart = e => {
    console.log("_onDeleteStart", e);
  };

  _onDeleteStop = e => {
    console.log("_onDeleteStop", e);
  };

  render() {
    return (
      <Map  center={[38.244, 27.1699]} zoom={15} zoomControl={false}>
        <FullscreenControl position="topleft" />
          <TileLayer
              url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.neocrea.com.tr/">NeoCrea</a> Software Solutions'
          />
          <FeatureGroup
            ref={reactFGref => {
              this._onFeatureGroupReady(reactFGref);
            }}

          >
            <EditControl
              position="topright"
              onEdited={this._onEdited}
              onCreated={this._onCreated}
              onDeleted={this._onDeleted}
              onMounted={this._onMounted}
              onEditStart={this._onEditStart}
              onEditStop={this._onEditStop}
              onDeleteStart={this._onDeleteStart}
              onDeleteStop={this._onDeleteStop}
            />
          </FeatureGroup>
      </Map>
    );
  }

  _editableFG = null;

  _onFeatureGroupReady = reactFGref => {
    let leafletGeoJSON = undefined
    // populate the leaflet FeatureGroup with the geoJson layers
    fetch(
        "https://gist.githubusercontent.com/MaxAndolini/07846b5071dfac25c61db8fa5f45267a/raw/d0496d7ea29a12be586fe2355e78cbfb73787404/arazi.json"
    )
        .then((response) => response.json())
        .then((data) => {
          leafletGeoJSON = new L.GeoJSON(
              {
                features: data.features,
                type:"FeatureCollection"
              }
          );
        })
        .catch((error) => console.log(error));

    let leafletFG = reactFGref.leafletElement;

    setTimeout(()=>{
      leafletGeoJSON.eachLayer(layer => {
        leafletFG.addLayer(layer);
      });
    } , 1000)

    // store the ref for future access to content

    // this._editableFG = reactFGref;
  };

  _onChange = (e) => {
    console.log(e)
    // this._editableFG contains the edited geometry, which can be manipulated through the leaflet API
    const { onChange } = this.props;

    if (!this._editableFG || !onChange) {
      return;
    }
    const geojsonData = this._editableFG.leafletElement.toGeoJSON();
    onChange(geojsonData);
  };
}

// data taken from the example in https://github.com/PaulLeCam/react-leaflet/issues/176

