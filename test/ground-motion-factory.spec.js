/* global afterEach, beforeEach, describe, it */
'use strict';


var expect = require('chai').expect,
    GroundMotionFactory = require('../src/lib/ground-motion-factory');

var EPSILION = 0.00001;

describe('GroundMotionFactory test suite', function () {
  var groundMotionFactory;

  beforeEach(() => {
    groundMotionFactory = GroundMotionFactory();
  });

  afterEach(() => {
    groundMotionFactory = null;
  });


  describe('Constructor', () => {
    it('is defined', () => {
      expect(typeof GroundMotionFactory).to.equal('function');
    });

    it('can be instantiated', () => {
      expect(GroundMotionFactory).to.not.throw(Error);
    });

    it('can be destroyed', () => {
      expect(groundMotionFactory.destroy).to.not.throw(Error);
    });
  });


  describe('interpolate', () => {
    it('interpolates one point correctly', () => {
      var data,
          interpolate;

      // sample data with one point
      data = {
        'points': [
          {
            'latitude': 34,
            'longitude': -118,
            'ss': 1.91449,
            's1': 0.571707,
          }
        ],
        'latitude': 34,
        'longitude': -118
      };

      interpolate = groundMotionFactory.interpolate(data);

      expect(interpolate).to.deep.equal(data.points[0]);
    });

    it('interpolates two points correctly', () => {
      var data,
          interpolate;

      data = {
        'points': [
          {
            'latitude': 34,
            'longitude': -180,
            'ss': 10,
            's1': 10
          },
          {
            'latitude': 35,
            'longitude': -180,
            'ss': 20,
            's1': 20
          }
        ],
        'latitude': 34.4,
        'longitude': -180,
      };

      interpolate = groundMotionFactory.interpolate(data);

      expect(interpolate.ss).to.be.closeTo(14, EPSILION);
      expect(interpolate.s1).to.be.closeTo(14, EPSILION);
    });
  });

  it('interpolates four points correctly', () => {
    var data,
        interpolate;

    data = {
      'points': [
        {
          'latitude': 34,
          'longitude': -180,
          'ss': 10,
          's1': 10
        },
        {
          'latitude': 34,
          'longitude': -170,
          'ss': 20,
          's1': 20
        },
        {
          'latitude': 35,
          'longitude': -180,
          'ss': 20,
          's1': 20
        },
        {
          'latitude': 35,
          'longitude': -170,
          'ss': 10,
          's1': 10
        }
      ],
      'latitude': 34.4,
      'longitude': -174
    };

    interpolate = groundMotionFactory.interpolate(data);

    expect(interpolate.ss).to.be.closeTo(15.2, EPSILION);
    expect(interpolate.s1).to.be.closeTo(15.2, EPSILION);
  });

  describe('interpolateValue', () => {
    it('interpolateValue is correct', () => {
      expect(groundMotionFactory.interpolateValue(0, 1, 0, 2, 1/2)).to.equal(1);
    });
  });

});