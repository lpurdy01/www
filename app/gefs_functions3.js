/**
 * @version $Id: gefs_functions3.js  version 0.1 Created by team GEFS-KHS
 */

function getData() {

    //http://localhost/gefs/app/fields.json
    getJSON('https://api.collaborate.org/v4/intelecells/9999999900040000/fields?token=f17493cb11ad3bf4837945f887ef396a').then(processData, function(status) { //error detection....
        alert('Error.  Could not read data.');
    });
}

// ********************* getJSON *********************

function getJSON(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            var status = xhr.status;
            if (status == 200) {
                resolve(xhr.response);
            } else {
                reject(status);
            }
        };
        xhr.send();
    });
}

// ********************* processData *********************

function processData(data) {
//alert(JSON.stringify(data[0]));
    //alert("Old Harbor x=" + data[37].latestReading + " y=" + data[38].latestReading + " z=" + data[39].latestReading);
    // add 3 for Kodiak
    var x = data[34].latestReading;
    var y = data[35].latestReading;
    var z = data[36].latestReading;
    document.getElementById("input_x").value = x;
    document.getElementById("input_y").value = y;
    document.getElementById("input_z").value = z;
    //alert("Old Harbor current reading x=" + x + " y=" + y + " z=" + z);
    drawArrow(x,y,z);
}

function drawArrow(x,y,z) {
// ******************* Compass Arrow ***********************
    //var index = wwd.layers.length -1;
    //wwd.removeLayer(wwd.layers[index]);
    // or
    //wwd.removeLayer(arrowShapesLayer);

    var shapeAttributes = new WorldWind.ShapeAttributes(null);
    shapeAttributes.interiorColor = WorldWind.Color.YELLOW;
    shapeAttributes.outlineColor = WorldWind.Color.YELLOW;
    shapeAttributes.drawInterior = false;
    shapeAttributes.outlineWidth = 2;
    shapeAttributes.outlineStipplePattern = 0x3333;
    shapeAttributes.outlineStippleFactor = 0;
    if (x){
        var shapeBoundaryKodiakArrow = getArrow(57.793522814403858, -152.393614471696509, 1000, x, y, z);
        var surfacePolygonKodiakArrow = new WorldWind.SurfacePolygon(shapeBoundaryKodiakArrow, new WorldWind.ShapeAttributes(shapeAttributes));
        surfacePolygonKodiakArrow.highlightAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
        arrowShapesLayer.removeAllRenderables();
        arrowShapesLayer.addRenderable(surfacePolygonKodiakArrow);
        wwd.redraw();
    }
}

// ********************* getArrow *********************

function getArrow(centroid_lat,centroid_lon,arrow_radius,x_axis,y_axis,z_axis) {
    // Given the center lat, center lon, arrow radius(not yet implemented see adjscale), x(north) magnitude, y(east) magnitude, and  z(vertical) magnitude (not yet implemented)
    // Returns an array of WorldWind.Location objects in the shape of an arrow, with the center at centroid_lat, cnetroid_lon, and pointing in the direction of (x,y)
    // radius: radius in meters of the circle the arrow fits in.  This can be changed in the web app. Not yet implemented

    // A polygon in the shape of an arrow can be created with 6 points.
    // The first and last points are the same to close the polygon.

    var adjscale = .1; // adjust the scale of the arrow

    var lat0, lon0, latx, lony;
    var offsetangle, scale;
    var pointC,pointD,pointE,pointF,pointG,pointH;
    //initialized variables

    lat0 = parseFloat(centroid_lat);
    lon0 = parseFloat(centroid_lon);
    latx = lat0 + adjscale * parseFloat(x_axis);
    lony = lon0 + adjscale * parseFloat(y_axis);
    //the returned value for centroid_lat is a string, so you need parseFloat to make it a number

    //alert(x_axis + " y=" + y_axis);

    if (x_axis && y_axis) { //checks to see if there is even a value for the x_axis and y_axis

        //alert("lat0 = "+lat0+"\n"+"lon0 = "+lon0+"\n"+"latx = "+latx+"\n"+"lony = "+lony+"\n"); // comment in for debug

        offsetangle = offSetAngle(lat0,lon0,latx,lony); //finds the angle of the center to tip

        //alert("The offset angle is: "+ offsetangle);

        scale = (Math.sqrt(Math.pow((lony-lon0),2) + Math.pow((latx-lat0),2))) / (12);
        // returns a scale value, so you don't end up with a very skinny or fat arrow

        //alert("The scale is: "+ scale);

        pointC = offsetPoint(offsetangle, 51.829, 6.403, scale, lat0, lon0);
        pointD = offsetPoint(offsetangle, 28.126, 4.243, scale, lat0, lon0);
        pointE = offsetPoint(offsetangle, -9.462, -12.166, scale, lat0, lon0);
        pointF = offsetPoint(offsetangle, -51.829, 6.403, scale, lat0, lon0);
        pointG = offsetPoint(offsetangle, -28.126, 4.243, scale, lat0, lon0);
        pointH = offsetPoint(offsetangle, 9.462, -12.166, scale, lat0, lon0);

        //in offsetPoint there is an alert line comment it in for debug
    }

    return [ //an array of WW locations that outlines the arrow
        pointD,
        pointC,
        new WorldWind.Location(latx,lony),
        pointF,
        pointG,
        pointH,
        pointE,
        pointD
    ];
}
 // ******************offsetPoint*******************
function offsetPoint(offsetang, angle, dist, scale, centerlat, centerlon){

  // takes in the offsetand, angle of the point, distance to the point, scale of the arrow, centerlat, centerlon
    // and returns a worldwind location

    var lat,lon;

    lat = (Math.cos((angle*(Math.PI/180)) + (offsetang*(Math.PI/180))) * (dist * scale)) + centerlat;
    lon = (Math.sin((angle*(Math.PI/180)) + (offsetang*(Math.PI/180))) * (dist * scale)) + centerlon;

    //alert(lat+" , "+lon);

    return new WorldWind.Location(lat,lon);
}
 // ******************offsetAngle********************
function offSetAngle(x1, y1, x2, y2){

    //finds the angle of two points

    var slope = ((y2 - y1) / (x2 - x1));

    //alert(slope);

    var angle;

    if (x2 < x1){
        angle = (180 + (Math.atan(slope))*(180/Math.PI));

        //alert("it went 180+  "+angle);

    } else {
        angle = ((Math.atan(slope))*(180/Math.PI));

        //alert("it went stright  "+ angle);
    }

    //alert(offSetAngle);

    return angle;
}