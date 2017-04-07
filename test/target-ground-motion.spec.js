/* global afterEach, beforeEach, describe, it */
'use strict';

var expect = require('chai').expect,
    TargetGroundMotion = require('../src/lib/target-ground-motion');

describe('target-ground-motion', () => {
  var afe,
      badAfe,
      curve,
      targetGroundMotion;

  afe = 1;
  badAfe = 12;
  curve = [
    [0, 10],
    [1, 9],
    [2, 8],
    [3, 7],
    [4, 6],
    [5, 5],
    [6, 4],
    [7, 3],
    [8, 2],
    [9, 1],
    [10, 0]
  ];


  beforeEach(() => {
    targetGroundMotion = TargetGroundMotion();
  });

  afterEach(() => {
    targetGroundMotion.destroy();
  });

  describe('constructor', () => {
    it('is defined', () => {
      expect(typeof TargetGroundMotion).to.equal('function');
    });

    it('can be instantiated', () => {
      expect(TargetGroundMotion).to.not.throw(Error);
    });

    it('can be destroyed', () => {
      expect(() => {
        var targetGroundMotion;

        targetGroundMotion = TargetGroundMotion();
        targetGroundMotion.destroy();
      }).to.not.throw(Error);
    });
  });

  describe('findBounds', () => {
    it('finds correct bounds', () => {
      var points;

      points = [[8, 2], [9, 1]];

      expect(targetGroundMotion.findBounds(curve, afe)).to.deep.equal(points);
    });

    it('show error when afe value is outside curve range', () => {
      expect(() => targetGroundMotion.findBounds(curve, badAfe)).
          to.throw(Error);
    });
  });

  describe('getGroundMotionForProbability', () => {
    it('computes correct afe value', () => {
      expect(targetGroundMotion.getGroundMotionForProbability(.2)).
          to.equal(0.004462871026284194);
    });
  });

  describe('getTargetedGroundMotion', () => {
    it('gives correct target ground motion', () => {
      expect(targetGroundMotion.getTargetedGroundMotion(curve, .05)).
          to.equal(9.998974134112249);
    });
  });
});