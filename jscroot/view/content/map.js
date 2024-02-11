import { setInner } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.2/croot.js";
import { transform } from 'https://cdn.skypack.dev/ol/proj.js';
import {addCSSIn} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {id} from "../../url/config.js";
//map
import { overlay, popupinfo, map } from '../../controller/map/config.js';
import { popupInputMarker, onClosePopupClick, onMapPointerMove, disposePopover, onMapClick } from '../../controller/map/popup.js';
import { onClick } from '../../controller/map/element.js';

import { get } from '../../controller/map/api.js';
import { xxx } from '../../controller/map/template.js';
import { MakeGeojsonFromAPI, AddLayerToMAP } from '../../controller/map/controller.js';

export async function main(){
    setInner("biggreet", "");
    await addCSSIn("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",id.content);
    await addCSSIn("assets/css/forum.css",id.content);
}

onClick('overlay-closer', onClosePopupClick);
onClick('popupinfo-closer', onClosePopupClick);

const typeSelect = document.getElementById('type');
const geospatialSelect = document.getElementById('geospatial');
const styles = {
    Point: {
      'circle-radius': 5,
      'circle-fill-color': 'orange',
    },
    LineString: {
      'circle-radius': 5,
      'circle-fill-color': 'red',
      'stroke-color': 'red',
      'stroke-width': 1.5,
    },
    Polygon: {
      'circle-radius': 5,
      'circle-fill-color': 'blue',
      'stroke-color': 'blue',
      'stroke-width': 2,
      'fill-color': 'blue',
    },
};

let draw; // global so we can remove it later
let layer;
let value = typeSelect.value; // Move the variable definition here
let geospatial = geospatialSelect.value; // Move the variable definition here


function addInteraction() {
    // Remove the previous interaction and event listeners
    map.removeInteraction(draw);
    map.un('pointermove', onMapPointerMove);
    map.un('movestart', disposePopover);
    map.un('click', onMapClick);
    
    if (value !== 'None') {
        const source = new ol.source.Vector();

        draw = new ol.interaction.Draw({
            source: source,
            type: value,
        });
    
        layer = new ol.layer.Vector({
            source: source,
            style: styles[value],
        });
    
        map.addLayer(layer);
        map.addInteraction(draw);

        draw.on('drawend', function (event) {
            const feature = event.feature;
            const geometry = feature.getGeometry();
            let coordinates;

            if (geometry.getType() === 'Point') {
                coordinates = transform(geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326')
                map.on('click', function(e) {
                    overlay.setPosition(undefined)
                    popupinfo.setPosition(undefined)
                    if (typeSelect.value === 'Point') {
                        popupInputMarker(e, geometry.getType(), geospatial, coordinates)
                    }
                })
            } else if (geometry.getType() === 'LineString') {
                coordinates = geometry.getCoordinates().map((coord) =>
                    transform(coord, 'EPSG:3857', 'EPSG:4326')
                )
                map.on('click', function(e) {
                    overlay.setPosition(undefined)
                    popupinfo.setPosition(undefined)
                    if (typeSelect.value === 'LineString') {
                        popupInputMarker(e, geometry.getType(), geospatial, coordinates)
                    }
                })
            } else if (geometry.getType() === 'Polygon') {
                coordinates = geometry.getCoordinates().map((ring) =>
                    ring.map((coord) => transform(coord, 'EPSG:3857', 'EPSG:4326'))
                )
                map.on('click', function(e) {
                    overlay.setPosition(undefined)
                    popupinfo.setPosition(undefined)
                    if (typeSelect.value === 'Polygon') {
                        popupInputMarker(e, geometry.getType(), geospatial, coordinates)
                    }
                })
            }
        })
    
        document.getElementById('undo').addEventListener('click', function () {
            draw.removeLastPoint();
        });
    } else {
        map.on('pointermove', onMapPointerMove);
        map.on('movestart', disposePopover);
        map.on('click', onMapClick);
    }
}

typeSelect.onchange = function () {
    value = typeSelect.value;
    geospatial = geospatialSelect.value;
    map.removeInteraction(draw);
    addInteraction();
};

get(xxx, result => {
    let link = MakeGeojsonFromAPI(result)
    AddLayerToMAP(link)
});