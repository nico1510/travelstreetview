import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';
import Dropzone from 'react-dropzone';
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import request from 'superagent';

class ImageUploadComponent extends Component {

    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
    }

    onDrop(files) {
        //TODO: promise.all und dann setState und letztes file als selected auswählen
        var req = request.post(window.location.protocol + '//' + window.location.hostname + ':' + 3001 + '/photos/upload');
        files.forEach((file)=> {
            req.attach('travel_photos', file);
        });
        req.end(this.onFileUpload);
    }

    onFileUpload(err, res) {
        if(err) {
            console.log(err);
        } else {
            console.log(res);
        }
    }

    render() {
        return (
            <div className={css(styles.uploadZoneContainer)}>
                <Dropzone onDrop={this.onDrop}
                          multiple={true}
                          disablePreview={true}
                          accept="image/jpeg"
                          className={css(styles.uploadZone)}>
                    <div>Drag & Drop your images here or click to select files</div>
                    <div>
                        <FileCloudUpload />
                    </div>
                </Dropzone>
            </div>
        );
    }
}

const styles = StyleSheet.create({

    uploadZoneContainer: {
        display: 'inline-block',
        padding: '24px 24px 12px 12px'
    },

    uploadZone: {
        borderRadius: '50px',
        border: '2px dashed darkslategray',
        margin: '5px',
        minWidth: '230px',
        width: '230px',
        height: '230px',
        padding: '10px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ImageUploadComponent;
