/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SurfaceRectangle
 * @version $Id: SurfaceRectangle.js 2836 2015-02-24 03:19:56Z danm $
 */
define([
        '../geom/Angle',
        '../error/ArgumentError',
        '../geom/Location',
        '../util/Logger',
        '../shapes/ShapeAttributes',
        '../shapes/SurfaceShape',
        '../util/WWMath'
    ],
    function (Angle,
              ArgumentError,
              Location,
              Logger,
              ShapeAttributes,
              SurfaceShape,
              WWMath) {
        "use strict";

        /**
         * Constructs a surface rectangle with a specified center and size and an optional attributes bundle.
         * @alias SurfaceRectangle
         * @constructor
         * @augments SurfaceShape
         * @classdesc Represents a rectangle draped over the terrain surface.
         * <p>
         * SurfaceRectangle uses the following attributes from its associated shape attributes bundle:
         * <ul>
         *         <li>Draw interior</li>
         *         <li>Draw outline</li>
         *         <li>Interior color</li>
         *         <li>Outline color</li>
         *         <li>Outline width</li>
         *         <li>Outline stipple factor</li>
         *         <li>Outline stipple pattern</li>
         * </ul>
         * @param {Location} center The rectangle's center location.
         * @param {Number} width The rectangle's width in meters.
         * @param {Number} height The rectangle's height in meters.
         * @param {ShapeAttributes} attributes The attributes to apply to this shape. May be null, in which case
         * attributes must be set directly before the shape is drawn.
         * @throws {ArgumentError} If the specified center location is null or undefined or if either specified width
         * or height is negative.
         */
        var SurfaceRectangle = function (center, width, height, attributes) {
            if (!center) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceEllipse", "constructor", "missingLocation"));
            }

            if (width < 0 || height < 0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceEllipse", "constructor", "Size is negative."));
            }

            SurfaceShape.call(this, attributes);

            /**
             * This shape's center location.
             * @type {Location}
             */
            this.center = center;

            /**
             * This shape's width, in meters.
             * @type {Number}
             */
            this.width = width;

            /**
             * This shape's height in meters.
             * @type {Number}
             */
            this.height = height;

            /**
             * The shape's heading, specified as degrees clockwise from North. This shape's height and width are
             * relative to its heading.
             * @type {number}
             * @default 0
             */
            this.heading = 0;
        };

        SurfaceRectangle.prototype = Object.create(SurfaceShape.prototype);

        // Internal. Intentionally not documented.
        SurfaceRectangle.prototype.computeBoundaries = function(dc) {
            var halfWidth = 0.5 * this.width,
                halfHeight = 0.5 * this.height,
                globeRadius = dc.globe.radiusAt(this.center.latitude, this.center.longitude);


            this.boundaries = new Array(4);

            this.addLocation(0, -halfWidth, -halfHeight, globeRadius);
            this.addLocation(1,  halfWidth, -halfHeight, globeRadius);
            this.addLocation(2,  halfWidth,  halfHeight, globeRadius);
            this.addLocation(3, -halfWidth,  halfHeight, globeRadius);
        };

        SurfaceRectangle.prototype.addLocation = function(idx, xLength, yLength, globeRadius) {
            var distance = Math.sqrt(xLength * xLength + yLength * yLength);

            // azimuth runs positive clockwise from north and through 360 degrees.
            var azimuth = (Math.PI / 2.0) - (Math.acos(xLength / distance) * WWMath.signum(yLength) - this.heading * Angle.DEGREES_TO_RADIANS);

            this.boundaries[idx] = Location.greatCircleEndPosition(this.center, azimuth * Angle.RADIANS_TO_DEGREES, (distance / globeRadius) * Angle.RADIANS_TO_DEGREES);

        };

        return SurfaceRectangle;
    });