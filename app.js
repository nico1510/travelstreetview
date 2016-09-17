const express = require('express');
const app = express();
const ExifImage = require('exif').ExifImage;
const path = require('path');
const glob = require("glob");
const moment = require('moment');
const multer  = require('multer');

const staticPath = 'public';
const picsFolder = '/pics';
const picsDir = path.join(staticPath, picsFolder);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, picsDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
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

const config = require('./config')(process.env.NODE_ENV);

const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(allowCrossDomain);
app.use(express.static(staticPath));


function convertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);
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

app.post('/photos/upload', upload.array('travel_photos'), function (req, res, next) {
    console.log(req.files);
});

app.get(config.listEndpoint, function (req, res) {
    glob(path.join(__dirname, picsDir, '*.{jpg,jpeg,jpe}'), {nocase: true}, function (err, files) {
        if (err) {
            res.json({error: err});
        } else {
            var gpsPromiseList = files.map(function (file) {
                return new Promise(function (resolve, reject) {
                    new ExifImage({image: file}, function (error, exifData) {
                        if (error)
                            resolve({
                                src: req.protocol + '://' + req.get('host') + path.join(picsFolder, path.basename(file)),
                                gps: undefined,
                                orientation: undefined,
                                timestamp: undefined
                            });
                        else {
                            const gps = extractCoordinates(exifData.gps);
                            resolve({
                                src: req.protocol + '://' + req.get('host') + path.join(picsFolder, path.basename(file)),
                                gps,
                                orientation: exifData.image.Orientation,
                                timestamp: moment(exifData.exif.CreateDate, 'YYYY:MM:DD HH:mm:ss').unix()
                            });
                        }
                    });
                });
            });
            Promise.all(gpsPromiseList).then(res.json.bind(res)).catch(function (err) {
                console.log(err);   // this should never happen since the promise never rejects
            });
        }
    });
});

app.listen(port=config.ports.http, function () {
    console.log(`App listening on port ${port}!`);
});


