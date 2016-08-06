const express = require('express');
const app = express();
const ExifImage = require('exif').ExifImage;
const path = require('path');
const glob = require("glob");

const staticPath = 'public';
const picsFolder = '/pics';
const picsDir = path.join(staticPath, picsFolder);

app.use(express.static(staticPath));


function convertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + minutes/60 + seconds/(60*60);
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

function extractCoordinates(gps) {
    const lat = convertDMSToDD(...gps.GPSLatitude, gps.GPSLatitudeRef);
    const long = convertDMSToDD(...gps.GPSLongitude, gps.GPSLongitudeRef);
    const gmaps = `http://maps.google.com/maps?q=${lat},${long}`;
    const streetview = `http://maps.google.com/maps?q=&layer=c&cbll=${lat},${long}`;
    return {lat, long, gmaps, streetview};
}

app.get('/pos/:pic', function (req, res) {
    new ExifImage({image: path.join(__dirname, picsDir, req.params.pic)}, function (error, exifData) {
        if (error)
            res.json({error: error.message});
        else
            res.json(exifData.gps);
    });
});

app.get('/list', function (req, res) {
    glob(path.join(__dirname, picsDir, '*.jpg'), function (err, files) {
        if (err) {
            res.json({error: err});
        } else {
            var gpsPromiseList = files.map(function (file) {
                return new Promise(function (resolve, reject) {
                    new ExifImage({image: file}, function (error, exifData) {
                        if (error)
                            reject(error);
                        else {
                            resolve({
                                img: req.protocol + '://' + req.get('host') + path.join(picsFolder, path.basename(file)),
                                gps: extractCoordinates(exifData.gps),
                                timestamp: exifData.GPSDateStamp
                            });
                        }
                    });
                });
            });
            Promise.all(gpsPromiseList).then(function (result) {
                res.json(result);
            }).catch(function (err) {
                res.json({error: err.message})
            });
        }
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


