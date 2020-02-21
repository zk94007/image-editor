import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './UploadsTray.scss';
import { ELEMENT_SUB_TYPE } from '../../ElementsPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '@material-ui/core/Button';
import {
    faTrashAlt,
    faFileDownload,
} from '@fortawesome/free-solid-svg-icons';
const generateKey = (() => {
    var key = 0;
    return () => key += 1;
})();

function UploadsTray(props) {
    const [images, setImage] = useState([]);

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            if (e.target.files[0].type === "image/png" || e.target.files[0].type === "image/jpeg") {
                showUploadFile(e.target.files[0]);
            }
        }
    }

    const handleDelete = (key) => {
        setImage(prev => {
            var imagesArr = [...prev];
            imagesArr[key - 1] = '';
            return imagesArr;
        });
    }

    const showUploadFile = (file) => {
        var reader = new FileReader();
        reader.onload = function (data) {
            setImage(prev => {
                var imagesArr = [...prev];
                var key = generateKey();
                imagesArr.push(
                    <div className="image-block"
                        key={key}
                        style={{display: 'inline-block', float: 'left'}}
                    >   
                        <div className="image-settings">
                            <a href={data.target.result} download={file.name}>
                                <Button><FontAwesomeIcon icon={faFileDownload} size={"1x"} /></Button>
                            </a>
                            <Button onClick={() => handleDelete(key)}><FontAwesomeIcon icon={faTrashAlt} size={"1x"} /></Button>
                        </div>
                        <img src={data.target.result}
                            onDragStart={(e) => {
                                e.preventDefault();
                                return false;
                            }}
                            onMouseDown={props.mouseDownOnElement}
                            onClick={() => props.handleAddElement({
                                type: "Image",
                                value: data.target.result,
                                subType: ELEMENT_SUB_TYPE.IMAGE
                            })}
                            alt={file.name}>
                        </img>
                    </div>
                );
                return imagesArr;
            });
        };
        reader.readAsDataURL(file);
    }

    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach((file) => {
            showUploadFile(file);
        });
    }, []);

    const { getRootProps } = useDropzone({ onDrop, accept: 'image/png, image/jpeg' })
    return (
        <div style={{height: '80%'}}>
            <div className="upload-image-btn-wrapper">
                <input id="upload-image-btn" type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e)} />
                <label className="upload-image-btn-label" htmlFor="upload-image-btn">Upload an Image</label>
            </div>
            <div {...getRootProps()} className="uploads-tray" >
                {
                    !images.length &&
                    <p> ...or just drag image here from your desktop </p>
                }
                {images}
            </div>
        </div>
    );
}

export default UploadsTray;