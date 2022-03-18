import React from "react";
import { render } from "react-dom";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import Marker from "./../images/glass-marker.png";
import markerShadow from "./../images/marker-shadow.png";
import L from 'leaflet';

const Task2 = () => {
    const [fields, setFields] = React.useState(null);
    const [color = "black"] = React.useState();
    const colors = ["green", "blue", "yellow", "orange", "grey"];

    React.useEffect(() => {
        fetch(
            "https://gist.githubusercontent.com/MaxAndolini/07846b5071dfac25c61db8fa5f45267a/raw/d0496d7ea29a12be586fe2355e78cbfb73787404/arazi.json"
        )
            .then((response) => response.json())
            .then((data) => {
                const fields = data;
                setFields(fields);
            })
            .catch((error) => console.log(error));
    }, []);

    const changeFieldColor = (event) => {
        // Tıklayınca olacak işlemler
        event.target.setStyle({
            fillColor: color, // Rengi
            color: "green", // Border rengi
            fillOpacity: 1 // Opaklığı
        });
    };

    const glassIcon = new L.Icon({
        iconUrl: Marker,
        iconSize: [26, 26],
        popupAnchor: [0, -15],
        shadowUrl: markerShadow,
        shadowAnchor: [13, 28]
    });

    const onPointToLayer = (feature, latlng) => {
        return L.marker(latlng, {
            icon: glassIcon
        });
    };

    const onEachFeature = (feature, layer) => {
        const fieldName = feature.properties.Name;
        console.log(fieldName);
        layer.bindPopup(fieldName); // Popup

        //layer.options.fillOpacity = Math.random(); // 0-1 (0.1, 0.2, 0.3)
        const colorIndex = Math.floor(Math.random() * colors.length);
        layer.options.fillColor = colors[colorIndex]; //0

        layer.on({
            click: changeFieldColor
        });
    };

    return (
        <div>
            <Map
                style={{ height: "100vh", width: "50vw" }}
                zoom={15} // Harita başladığında olan zoom
                minZoom={15} // En fazla yapılabilecek zoom
                center={[38.244, 27.1897]} // Haritanın merkezi
                maxBounds={[[38.244, 27.1897]]} // Dışarı çıkılmaması gereken alan
            >
                <TileLayer
                    url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.neocrea.com.tr/">NeoCrea</a> Software Solutions'
                />
                {fields && (
                    <GeoJSON
                        data={fields}
                        style={() => ({
                            fillColor: "red", // Rengi
                            fillOpacity: 1, // Opaklığı
                            color: "black", // Border rengi
                            weight: 3 // Border kalınlığı
                        })}
                        onEachFeature={onEachFeature}
                        pointToLayer={onPointToLayer}
                    />
                )}
                {/*<SetViewOnClick />*/}
            </Map>
        </div>
    );
}

export default Task2