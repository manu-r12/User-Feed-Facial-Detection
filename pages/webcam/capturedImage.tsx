import React, { useEffect, useRef, useState } from 'react'
import styles from './styels.module.css'
import { useSelector } from 'react-redux'
import { getImageURL } from '@/reducer/imageSelector'
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import { useRouter } from 'next/router';
import * as faceapi from '@vladmandic/face-api';



const CapturedImage = () => {

    const imgUrl = useSelector(getImageURL)
    const router  = useRouter()
    const [error , setError] = useState<boolean>(false)
    const [isDetecting , setIsDetecting] = useState<boolean>(false)
    const [faceDetections, setFaceDetections] = useState<any>({})
    const [showFaceInfo, setShowFaceInfo]  = useState<boolean>(false)
    const [mood, setMood] = useState<any>()
  
    useEffect(() =>{
        loadFaceApiModels();
    }, [])

    const loadFaceApiModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      await faceapi.nets.ageGenderNet.loadFromUri('/models');
    };
   
    

    const handleImageUpload = () => {
        if (imgUrl) {
          const image = new Image();
          image.src = imgUrl;
        
          processImage(image);
         
        }
      };
    
    const handleClick = () =>{
        handleImageUpload();
      
    }
   

    const processImage =  async ( image: HTMLImageElement) =>{

        try{
   
            setIsDetecting(true)
            const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
            const detector = await faceDetection.createDetector(model, {runtime : 'tfjs'});
    
            const estimationConfig = {flipHorizontal: false};
        
            const faces = await detector.estimateFaces(image, estimationConfig);
          
            const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions().withAgeAndGender();
            
            setFaceDetections(detections[0])
            const expressions : any = detections[0].expressions

            const highestAccuracyExpression = Object.keys(expressions).reduce((prevExpression, currentExpression) => {
              return expressions[currentExpression] > expressions[prevExpression] ? currentExpression : prevExpression;
            }, Object.keys(expressions)[0]);
            setMood(highestAccuracyExpression)
           

            setIsDetecting(false)
            setShowFaceInfo(true)

            const container = document.getElementById('imageContainer');
            const existingOverlays = container?.querySelectorAll('.face-overlay');
            const existingLabel = container?.querySelectorAll('.face-label');
            existingOverlays?.forEach((overlay) => overlay.remove());
            existingLabel?.forEach((label) => label.remove());
           
           
            faces.forEach((face) =>{
              const overlay = document.createElement('div');
              overlay.classList.add('face-overlay');
              overlay.style.position = 'absolute';
              overlay.style.border = '2px solid green';
              overlay.style.left = `${face.box.xMin}px`;
              overlay.style.top = `${face.box.yMin}px`;
              overlay.style.width = `${face.box.width }px`;
              overlay.style.height = `${face.box.height}px`;

              const infoLabel = document.createElement('div');
              infoLabel.classList.add('face-label');
              const roundedXMax = Math.round(face.box.xMax);
              const roundedYMaax = Math.round(face.box.yMax);
              const roundedWidth = Math.round(face.box.width);
              const roundedHeight = Math.round(face.box.height);
              infoLabel.innerHTML = `Position: (${roundedXMax}, ${roundedYMaax})<br/>Size: ${roundedWidth} x ${roundedHeight}`;
              infoLabel.style.position = 'absolute';
              infoLabel.style.backgroundColor = "white"
              infoLabel.style.padding = '0 10px'
              infoLabel.style.fontFamily = "Montserrat, sans-serif"
              infoLabel.style.fontWeight = "600"
              infoLabel.style.left = `${face.box.xMin }px`;
              infoLabel.style.top = `${face.box.yMin + 40}px`;
              infoLabel.style.transform = 'translate(100%, 100%)';
              infoLabel.style.color = 'black';
              const container = document.getElementById('imageContainer')
              if(container){
                container.appendChild(overlay)
                container.appendChild(infoLabel);
              }

            })

        }catch(er){
            setError(true)
        }
      
    }




  return (
    <div className={styles.container} >
       <div className={styles.navContainer}>
            <div style={{backgroundColor:"black", cursor: "pointer"}}  onClick={() => router.push("captureAnImage")} className={styles.linkOne}>1</div>
            <div className={styles.line}/>
            <div style={{backgroundColor:"rgb(71, 168, 69)" , border: "none", color:"white"}} className={styles.linkTwo}>2</div>
        </div>
        <div className={styles.imageSection}>
        <div className={styles.imageContainer}  id='imageContainer'>
           <img src={imgUrl} className={styles.capturedImage} alt='you-captured-image'/>
           {showFaceInfo &&  <div className={styles.faceInformations}>
            <h1>You Look: {mood} </h1>
            <h1>Gender: {faceDetections.gender}</h1>
            <h1>Age: {Math.round(faceDetections.age) | 1} years</h1>
          </div>}
        </div>
        <div className={styles.functionsContainer}> 
          <h1 >Your face is beautiful! 🙃</h1>
        
          <div>
           <button style={{width: "200px"}} className={styles.selectButton} onClick={handleClick}>{isDetecting ? "Detecting👀" : "Start Detection"}</button>
          </div>
        </div>
       </div>
       
    </div>

  )
}

export default CapturedImage