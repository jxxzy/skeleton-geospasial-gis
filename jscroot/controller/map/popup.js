import { toLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { overlay, map, popupinfo } from './config.js';
import { clickpopup, aaa, bbb, ccc, qqq, www, eee, rrr, ttt, yyy, uuu } from './template.js';
import { setInner, setValue } from './element.js';
import { getCookie } from './cookie.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js';

export function onClosePopupClick() {
    overlay.setPosition(undefined);
}

export function popupInputMarker(evt, type, geospatial, coordinates) {
    let tile = evt.coordinate;
    let name = document.getElementById('inputname');
    let max = document.getElementById('inputmax');
    let min = document.getElementById('inputmin');
    let radius = document.getElementById('inputradius');
    let msg = clickpopup.replace("#COORDINATE#", coordinates).replace("#TYPE#", type);
    setInner('popup-content', msg);
    setValue('koordinattt', coordinates);
    overlay.setPosition(tile);


        
    let insertmarkerbutton = document.getElementById('insertmarkerbutton');
    insertmarkerbutton?.addEventListener('click', async () => {
        const token = getCookie('token');
        let data = {
            "type": "Feature",
            "properties": {
            "name": name.value
            },
            "geometry": {
            "type": type,
            "coordinates": coordinates
            }
        };
        
        if (type === 'Point') {
            try {
                const response = await fetch(aaa, {
                    method: 'POST',
                    body: JSON.stringify(data), // Send the data object, not individual variables
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
    
                const responseData = await response.json();
                if (responseData.status === false) {
                    console.log(responseData.message);
                } else {
                    console.log(responseData.message);
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (type === 'LineString') {
            try {
                const response = await fetch(bbb, {
                    method: 'POST',
                    body: JSON.stringify(data), // Send the data object, not individual variables
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
    
                const responseData = await response.json()
                if (responseData.status === false) {
                    console.log(responseData.message);
                } else {
                    console.log(responseData.message);
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (type === 'Polygon') {
            try {
                const response = await fetch(ccc, {
                    method: 'POST',
                    body: JSON.stringify(data), // Send the data object, not individual variables
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
    
                const responseData = await response.json();
                if (responseData.status === false) {
                    console.log(responseData.message);
                } else {
                    console.log(responseData.message);
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error:', error)
            }
        };
    })

    let findmarkerbutton = document.getElementById('findmarkerbutton');
    findmarkerbutton?.addEventListener('click', async () => {
        const token = getCookie('token');
        let datageospatial = {
            "type": type,
            "coordinates": coordinates,
            "max": parseFloat(max.value),
            "min": parseFloat(min.value),
            "radius": parseFloat(radius.value),
        };
        
        if (geospatial === 'GeoInstects') {
            try {
                const response = await fetch(qqq, {
                    method: 'POST',
                    body: JSON.stringify(datageospatial), // Send the data object, not individual variables
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
    
                const responseData = await response.json();
                if (responseData.status === false) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: responseData.message,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonColor: "#F27474",
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    if (responseData.empty === true) {
                        Swal.fire({
                            icon: "warning",
                            title: "Warning",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#F8BB86",
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#A5DC86",
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (geospatial === 'GeoWithin') {
            try {
                const response = await fetch(www, {
                    method: 'POST',
                    body: JSON.stringify(datageospatial), // Send the data object, not individual variables
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
    
                const responseData = await response.json()
                if (responseData.status === false) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: responseData.message,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonColor: "#F27474",
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    if (responseData.empty === true) {
                        Swal.fire({
                            icon: "warning",
                            title: "Warning",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#F8BB86",
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#A5DC86",
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (geospatial === 'Near') {
            try {
                const response = await fetch(eee, {
                    method: 'POST',
                    body: JSON.stringify(datageospatial), // Send the data object, not individual variables
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
    
                const responseData = await response.json();
                if (responseData.status === false) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: responseData.message,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonColor: "#F27474",
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    if (responseData.empty === true) {
                        Swal.fire({
                            icon: "warning",
                            title: "Warning",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#F8BB86",
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#A5DC86",
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                }
            } catch (error) {
                console.error('Error:', error)
            }
        } else if (geospatial === 'NearSphere') {
            try {
                const response = await fetch(rrr, {
                    method: 'POST',
                    body: JSON.stringify(datageospatial), // Send the data object, not individual variables
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
    
                const responseData = await response.json();
                if (responseData.status === false) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: responseData.message,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonColor: "#F27474",
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    if (responseData.empty === true) {
                        Swal.fire({
                            icon: "warning",
                            title: "Warning",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#F8BB86",
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#A5DC86",
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                }
            } catch (error) {
                console.error('Error:', error)
            }
        } else if (geospatial === 'Box') {
            try {
                const response = await fetch(ttt, {
                    method: 'POST',
                    body: JSON.stringify(datageospatial), // Send the data object, not individual variables
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
    
                const responseData = await response.json();
                if (responseData.status === false) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: responseData.message,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonColor: "#F27474",
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    if (responseData.empty === true) {
                        Swal.fire({
                            icon: "warning",
                            title: "Warning",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#F8BB86",
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#A5DC86",
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                }
            } catch (error) {
                console.error('Error:', error)
            }
        } else if (geospatial === 'Center') {
            try {
                const response = await fetch(yyy, {
                    method: 'POST',
                    body: JSON.stringify(datageospatial), // Send the data object, not individual variables
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
    
                const responseData = await response.json();
                if (responseData.status === false) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: responseData.message,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonColor: "#F27474",
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    if (responseData.empty === true) {
                        Swal.fire({
                            icon: "warning",
                            title: "Warning",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#F8BB86",
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#A5DC86",
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                }
            } catch (error) {
                console.error('Error:', error)
            }
        } else if (geospatial === 'CenterSphere') {
            try {
                const response = await fetch(uuu, {
                    method: 'POST',
                    body: JSON.stringify(datageospatial), // Send the data object, not individual variables
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
    
                const responseData = await response.json();
                if (responseData.status === false) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: responseData.message,
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonColor: "#F27474",
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    if (responseData.empty === true) {
                        Swal.fire({
                            icon: "warning",
                            title: "Warning",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#F8BB86",
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: responseData.message,
                            showConfirmButton: true,
                            showCancelButton: false,
                            confirmButtonColor: "#A5DC86",
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }
    })
}

function popupGetMarker(evt, features) {
    let title = features.get('name');
    setInner('popupinfo-title',title);
    let ctnt = "type : " + features.getGeometry().getType() + "<br>XY : " + toLonLat(evt.coordinate);
    setInner('popupinfo-content', ctnt);
    popupinfo.setPosition(evt.coordinate);
}

export function onMapPointerMove(evt) {
    const pixel = map.getEventPixel(evt.originalEvent);
    const hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
}

export function disposePopover() {
    if (overlay && popupinfo) {
        overlay.setPosition(undefined);
        popupinfo.setPosition(undefined);
    }
}

export function onMapClick(evt) {
    let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    overlay.setPosition(undefined);
    popupinfo.setPosition(undefined);
    if (!feature) {
        popupInputMarker(evt);
        return;
    } else {
        popupGetMarker(evt,feature);
    }
}