import React, { useState, useContext } from 'react';
import imageCompression from 'browser-image-compression';
import './style.css';

const UploadImage = () => {

  const [fileName, setFileName] = useState("Choose File");
  const [inputFile, setInputFile] = useState('');
  const [compressedFile, setCompressedFile] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [image, setImage] = useState('');
  const [imageDimensions, setImageDimensions] = useState('1024');
  const [compressedImageSize, setCompressedImageSize] = useState('');
  const [originalImageSize, setOriginalImageSize] = useState('');
  const [compressedFileUrl, setCompressedFileUrl] = useState('');

  const handleImageChange = (e) => {
    if(e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setInputFile(e.target.files[0]);
    }
  }
  const showImagePreview = (compressedFile) => {
    let oFReader = new FileReader();
    oFReader.readAsDataURL(compressedFile);
    oFReader.onload = (oFREvent) => {
      setImage(oFREvent.target.result);
    }
  }
  const compressImage = async () => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: imageDimensions,
      useWebWorker: true,
    }
    try {
      const cFile = await imageCompression(inputFile, options);
      showImagePreview(cFile);
      setCompressedFile(cFile);
      console.log('cfile', cFile.size/1000, cFile);
      if(cFile.size/1000 > 1000) {
        setCompressedImageSize(`${cFile.size/1000/1000} mb`);
      } else {
        setCompressedImageSize(`${cFile.size/1000} kb`);
      }
      if(inputFile.size/1000 > 1000) {
        setOriginalImageSize(`${inputFile.size/1000/1000} mb`);
      } else {
        setOriginalImageSize(`${inputFile.size/1000} kb`);
      }
      setCompressedFileUrl(URL.createObjectURL(cFile));

      return cFile;
    } catch (error) {
      setErrorMessage('Failure to Compress File, Please try again later')
    }
  }

  const handlePreview = async (e) => {
    e.preventDefault();
    if(compressedFile.name === fileName) {
      //image is already shown so do nothing
    } else {
      let file = await compressImage();
      if(!file) {
        setErrorMessage('Please choose a file to upload')
      }
    }
  }

  

  return (
    <div className="upload-post-parent">
      <div className="upload-post">
        <h1>Compress your Image</h1>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form>
          <label className="size-label" for="image-size">Max Width or Height</label>
          <input id="image-size" type="number" value={imageDimensions} className="image-size-input" onChange={(e) => {setImageDimensions(e.target.value)}}></input>
          <label className="custom-file-input">
            <span className="file-name">{fileName}</span>
            <span className="browse">Browse</span>
            <input type="file" accept="image/*" className="file-input" onChange={handleImageChange}/>
          </label>
          <div className="button-parent">
            {/* <input type="submit" className="button" value="Compress" /> */}
            <a href={compressedFileUrl} target={compressedFile} download={`${fileName}`}>Download</a>
            <input type="submit" className="button" value="Preview" onClick={handlePreview}/>
          </div>
        </form>
        <div className="compressed-image-size">
          {originalImageSize && <p>Original Image Size: {originalImageSize}</p>}
          {compressedImageSize && <p>Compressed Image Size: {compressedImageSize}</p>}
        </div>
        <div className="img-parent">
          <img alt="" src={image}/>
        </div>
      </div>
    </div>
  );
}

export default UploadImage;