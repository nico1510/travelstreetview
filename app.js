"use strict";
const express = require('express');
const app = express();
const ExifImage = require('exif').ExifImage;
const path = require('path');
const glob = require("glob");
const moment = require('moment');
const multer  = require('multer');
const session = require('express-session');
const uuid = require('uuid');

const staticPath = 'public';
const clientPath = 'react-client/build';
const picsFolder = '/pics';
const picsUrlFragment = '/tmp/';
const picsDirFullPath = path.join(staticPath, picsFolder);
const config = require('./config')(process.env.NODE_ENV);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, picsDirFullPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + uuid.v1() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype !== 'image/jpeg') {
            cb(null, false);
        } else if(!path.extname(file.originalname).match(/\.(jp?g|jpe)$/i)) {
            cb(null, false);
        } else {
            cb(null, true)
        }
    }
});

app.use(express.static(clientPath));

app.use(session({
    secret: config.cookieSecret,
    name: 'travel_streetview_session',    // this could be anything http://stackoverflow.com/questions/2097843/naming-cookies-best-practices
    resave: false,
    saveUninitialized: false
}));


app.post('/photos/upload', upload.array('travel_photos'), function (req, res) {
    req.session.uploads = req.session.uploads || [];

    const gpsPromiseList = req.files.map((fileInfo) => {
        const file = path.join(__dirname, fileInfo.path);
        return new Promise(function (resolve) {
            new ExifImage({image: file}, function (error, exifData) {
                const src = req.protocol + '://' + req.get('host') + path.join(picsUrlFragment, picsFolder, fileInfo.filename);
                if (error)
                    resolve({
                        src,
                        gps: undefined,
                        orientation: undefined,
                        timestamp: undefined
                    });
                else {
                    const gps = extractCoordinates(exifData.gps);
                    resolve({
                        src,
                        gps,
                        orientation: exifData.image.Orientation,
                        timestamp: moment(exifData.exif.CreateDate, 'YYYY:MM:DD HH:mm:ss').unix()
                    });
                }
            });
        });
    });
    Promise.all(gpsPromiseList).then(result => {
        req.session.uploads = result.reverse().concat(req.session.uploads);
        res.json({success: true});
    }).catch(function (err) {
        // this should never happen since the promise never rejects
        console.trace(err);
        res.json({success: false});
    });
});

app.get(path.join(picsUrlFragment, picsFolder) + '/:filename', function (req, res) {
    // only allow access to photos which were uploaded by the user (in the same session)
    const filename = req.params.filename;
    if(req.session.uploads && req.session.uploads.find(upload => upload.src.split('/').pop() === filename)) {
        res.sendFile(filename, {root: picsDirFullPath});
    } else {
        res.status(404).send('Not found');
    }
});


app.get(config.listEndpoint, function (req, res) {
    res.json(req.session.uploads || []);
});

app.listen(config.ports.http, function () {
    console.log(`App listening on port ${config.ports.http}!`);
});


function convertDMSToDD(degrees, minutes, seconds, direction) {
    let dd = degrees + minutes/60 + seconds/(60*60);
    if (direction === 'S' || direction === 'W') {
        dd = dd * -1;
    }
    return dd;
}

function extractCoordinates(gps) {
    if(gps.GPSLatitude && gps.GPSLongitude) {
        const lat = convertDMSToDD(...gps.GPSLatitude, gps.GPSLatitudeRef);
        const lng = convertDMSToDD(...gps.GPSLongitude, gps.GPSLongitudeRef);
        return {lat, lng};
    } else {
        return {};
    }
}
