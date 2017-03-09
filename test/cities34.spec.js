/* global before, describe, it */
'use strict';

var allcities = require('../etc/cities34.js'),
    expect = require('chai').expect,
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    querystring = require('querystring');


var compareResult,
    fetchResult,

    CLIENT,
    CONFIG,
    CONFIG_FILE,
    EPSILON,
    SERVICE_URL;


compareResult = function (expected, actual) {
  expect(expected.ss).to.be.closeTo(actual.data.data.ss, EPSILON);
  expect(expected.s1).to.be.closeTo(actual.data.data.s1, EPSILON);
  expect(expected.pga).to.be.closeTo(actual.data.data.pga, EPSILON);
};

fetchResult = function (city) {
  var params,
      url;

  params = {
    latitude: city.latitude,
    longitude: city.longitude,
    referenceDocument: 'ASCE7-16',
    riskCategory: 'III',
    siteClass: 'C',
    // This is a hack until the service is patched to escape params
    title: city.name.replace(/ /g, '_')
  };

  url = SERVICE_URL + '?' + querystring.stringify(params);

  return new Promise((resolve, reject) => {
    CLIENT.get(url, (response) => {
      var buffer;

      buffer = [];

      response.on('data', (chunk) => {
        buffer.push(chunk);
      });

      response.on('end', () => {
        resolve({
          expected: city,
          actual: JSON.parse(buffer.join(''))
        });
      });

    }).on('error', (err) => {
      reject(err);
    });
  });
};

//
// Specify a different configuration file to test the service running
// at different locations. eg. production, development, local, etc...
// Configuration files can specify the following:
//    - MOUNT_PATH : Optional {String} Default: ''
//                   Base URL path to the application
//    - PORT : Optional {Integer} Default: 80
//             Port number on which server is listening for connections
//    - HOST : Optional {String} Default: 'localhost'
//             Server host name to make connections against
//    - EPSILON : Optional {Decimal} Default: 1E-3
//                Tolerance for variance between expected and actual values
//
CONFIG_FILE = 'src/conf/config.json';
CONFIG = JSON.parse(fs.readFileSync(CONFIG_FILE));
EPSILON = CONFIG.EPSILON || 1E-3;


describe('34 Fixed Cites QA', () => {
  before(() => {
    var host,
        path,
        protocol,
        port;

    path = (CONFIG.MOUNT_PATH || '') + '/design.json';
    port = CONFIG.PORT || 80;
    protocol = (port == 443) ? 'https:' : 'http:';
    host = CONFIG.HOST || 'localhost';

    // Do this so the :port is not included when the protocol implies it.
    if (port == 443 || port == 80) {
      port = '';
    } else {
      port = ':' + port;
    }

    if (protocol === 'https:') {
      CLIENT = https;
    } else {
      CLIENT = http;
    }

    SERVICE_URL = `${protocol}//${host}${port}${path}`;
  });

  describe(`ASCE7-16 (Tolerance: +/-${EPSILON})`, () => {
    var cities;

    cities = allcities['ASCE7-16'];

    cities.forEach((city) => {
      it(JSON.stringify(city), function (done) {
        this.timeout(5000); // Allow up to 5 seconds response time
        fetchResult(city).then((result) => {
          compareResult(result.expected, result.actual);
          done();
        }).catch((err) => {
          done(err);
        });
      });
    });

  });
});
