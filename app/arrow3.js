/*
 * @version $Id: arrow3.js version 0.1 Created by team GEFS-KHS
 */
// Declare global variables
var wwd,arrowShapesLayer;

// Libraries for requirejs
var my_includes = ['../src/WorldWind','./LayerManager/LayerManager','./gefs_functions3'];

function myApplication(ww, LayerManager,gefs) {
    "use strict";

    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

    wwd = new WorldWind.WorldWindow("canvasOne");
    wwd.addLayer(new WorldWind.BMNGLayer());
    wwd.addLayer(new WorldWind.BMNGLandsatLayer());
    wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer(null));
    wwd.addLayer(new WorldWind.CompassLayer);
    // Define global arrowShapesLayer
    arrowShapesLayer = new WorldWind.RenderableLayer("Arrow Shape");
    wwd.addLayer(arrowShapesLayer);

    var shapesLayer = new WorldWind.RenderableLayer("circles");
    var shapeAttributes = new WorldWind.ShapeAttributes(null);

    // ********************3 km circle **********************

    // Create a 3 km circle centered on Kodiak.
    shapeAttributes.interiorColor = WorldWind.Color.YELLOW;
    shapeAttributes.outlineColor = WorldWind.Color.YELLOW;
    shapeAttributes.drawInterior = false;
    shapeAttributes.outlineWidth = 2;
    shapeAttributes.outlineStipplePattern = 0x3333;
    shapeAttributes.outlineStippleFactor = 0;
    var surfaceCircleKodiak = new WorldWind.SurfaceCircle(new WorldWind.Location(57.793522814403858, -152.393614471696509), 3000,
        new WorldWind.ShapeAttributes(shapeAttributes));

    var highlightShapeAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
    highlightShapeAttributes.interiorColor = WorldWind.Color.YELLOW;
    surfaceCircleKodiak.highlightAttributes = highlightShapeAttributes;

    shapesLayer.addRenderable(surfaceCircleKodiak);
    wwd.addLayer(shapesLayer);

    // ********************* 100 m circle *********************

    // Create a 100 m circle centered on Kodiak High School.
    shapeAttributes.interiorColor = WorldWind.Color.RED;
    shapeAttributes.outlineColor = WorldWind.Color.RED;
    var surfaceCircleKodiakHS = new WorldWind.SurfaceCircle(new WorldWind.Location(57.793522814403858, -152.393614471696509), 100,
        new WorldWind.ShapeAttributes(shapeAttributes));

    highlightShapeAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
    highlightShapeAttributes.interiorColor = WorldWind.Color.RED;
    surfaceCircleKodiakHS.highlightAttributes = highlightShapeAttributes;

    shapesLayer.addRenderable(surfaceCircleKodiakHS);
    // Add the shapes layer to the World Window's layer list.
    wwd.addLayer(shapesLayer);

    //wwd.redraw();

    getData();

}

requirejs(my_includes, myApplication);