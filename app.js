const express = require('express');
const app = express();
const ExifImage = require('exif').ExifImage;
const path = require('path');
const glob = require("glob");

const staticPath = 'public';
const picsFolder = '/pics';
const picsDir = path.join(staticPath, picsFolder);

app.use(express.static(staticPath));

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
                                gps: exifData.gps
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


