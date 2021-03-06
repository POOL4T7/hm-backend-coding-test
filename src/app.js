'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const logger = require('../logger/index')

module.exports = (db) => {
    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, (req, res) => {
        const startLatitude = Number(req.body.start_lat);
        const startLongitude = Number(req.body.start_long);
        const endLatitude = Number(req.body.end_lat);
        const endLongitude = Number(req.body.end_long);
        const riderName = req.body.rider_name;
        const driverName = req.body.driver_name;
        const driverVehicle = req.body.driver_vehicle;

        if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
            logger.customLogger.log('error', 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively')
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            logger.customLogger.log('error', 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively')
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
            });
        }

        if (typeof riderName !== 'string' || riderName.length < 1) {
            logger.customLogger.log('error', 'Rider name must be a non empty string')
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Rider name must be a non empty string'
            });
        }

        if (typeof driverName !== 'string' || driverName.length < 1) {
            logger.customLogger.log('error', 'Driver name must be a non empty string')
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Driver name must be a non empty string'
            });
        }

        if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
            logger.customLogger.log('error', 'Driver vechile must be a non empty string')
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Driver vehicle must be a non empty string'
            });
        }

        var values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle];

        db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
            if (err) {
                logger.customLogger.log('error', 'SERVER_ERROR')
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }
            
            db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                if (err) {
                    logger.customLogger.log('error', 'SERVER_ERROR')
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }

                res.send(rows);
            });
        });
    });

    app.get('/rides', async (req, res) => {
        const page = Number(req.query.page) || 1;
        const limit = req.query.limit || 2;
        const skip = limit * (page - 1);
        if (typeof page !== 'number') {
            return res.send({
                error_code: 'VALIDATION_ERROR',
                message: 'Page number must be integer'
            });
        }
        db.all(`SELECT * FROM Rides LIMIT ? OFFSET ?`, [limit, skip], function (err, rows) {
            if (err) {
                logger.customLogger.log('error', 'SERVER_ERROR')
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }

            if (rows.length === 0) {
                logger.customLogger.log('error', 'Could not find any rides')
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }

            res.send(rows);
        });
    });

    app.get('/rides/:id', (req, res) => {
        const riderId = Number(req.params.id)
        db.all(`SELECT * FROM Rides WHERE rideID = ?`, [riderId], function (err, rows) {
            if (err) {
                logger.customLogger.log('error', 'Unknown error')
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }
            if (rows.length === 0) {
                logger.customLogger.log('error', 'Could not find any rides')
                return res.send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }
            res.send(rows);
        });
    });

    return app;
};
