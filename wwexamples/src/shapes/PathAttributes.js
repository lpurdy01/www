/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports PathAttributes
 * @version $Id: PathAttributes.js 2843 2015-02-25 03:10:14Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../shapes/ShapeAttributes'
    ],
    function (ArgumentError,
              Logger,
              ShapeAttributes) {
        "use strict";

        /**
         * Constructs a path attributes bundle, optionally specifying a prototype set of attributes.
         * @alias PathAttributes
         * @constructor
         * @augments ShapeAttributes
         * @classdesc Holds attributes applied to World Wind path shapes.
         * @param {PathAttributes} attributes An attribute bundle whose properties are used to initially populate
         * the constructed attributes bundle. May be null, in which case the constructed attributes bundle is populated
         * with default attributes.
         */
        var PathAttributes = function (attributes) {

            ShapeAttributes.call(this, attributes);

            /**
             * Indicates whether this shape should draw vertical lines extending from the specified positions to the
             * ground.
             * @type {boolean}
             * @default false
             */
            this.drawVerticals = attributes ? attributes.drawVerticals : false;
        };

        PathAttributes.prototype = Object.create(ShapeAttributes.prototype);

        return PathAttributes;
    });