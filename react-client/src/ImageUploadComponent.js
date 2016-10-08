import React, {Component} from 'react';
import {StyleSheet, css} from 'aphrodite';
import Dropzone from 'react-dropzone';
import CircularProgress from 'material-ui/CircularProgress';
import FileCloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import request from 'superagent';

class ImageUploadComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {files: []};
        this.onDrop = this.onDrop.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
    }

    onDrop(files) {
        this.setState({files});
        var req = request.post('/photos/upload');
        files.forEach((file)=> {
            req.attach('travel_photos', file);
        });
        req.end(this.onFileUpload);
    }

    onFileUpload(err, res) {
        this.setState({files: []});
        if(err) {
            console.log(err);
        } else {
            if(res.body.success) {
                this.props.handleFileUpload();
            } else {
                console.log(res);
            }
        }
    }

    render() {
        let content;
        if (this.state.files.length) {
            content = (
                <div>
                    <CircularProgress />
                    <div>Uploading {this.state.files.length} {(this.state.files.length > 1)? 'files' : 'file'}</div>
                </div>
            );
        } else {
            content = (
                <div>
                    <div>Drag & Drop your images here or click to select files</div>
                    <div>
                        <FileCloudUpload />
                    </div>
                </div>
            );
        }
        return (
            <div className={css(styles.uploadZoneContainer)}>
                <Dropzone onDrop={this.onDrop}
                          multiple={true}
                          disablePreview={true}
                          accept="image/jpeg"
                          className={css(styles.uploadZone)}>
                    {content}
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
        borderRadius: '7vh',
        border: '2px dashed darkslategray',
        margin: '5px',
        minWidth: '24vh',
        width: '24vh',
        height: '24vh',
        padding: '10px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ImageUploadComponent;
