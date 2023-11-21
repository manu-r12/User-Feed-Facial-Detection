import React, { useEffect, useRef, useState } from 'react'
import styles from './styels.module.css'
import { useSelector } from 'react-redux'
import { getImageURL } from '@/reducer/imageSelector'
import { useRouter } from 'next/router';
import * as faceapi from 'face-api.js'
import { ArrowBack, Search, SearchOff, SearchOffRounded, SearchSharp } from '@mui/icons-material';
import Link from 'next/link';




const CapturedImage = () => {

    const imgUrl = useSelector(getImageURL)
    const router  = useRouter()
    const [isDetecting , setIsDetecting] = useState<boolean>(false)
    const imageRef = useRef<HTMLImageElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [screenDimensions, setScreenDimensions] = useState({
      width: (typeof window !== 'undefined' ? window.innerWidth : 0),
      height: (typeof window !== 'undefined' ? window.innerHeight : 0),
    });
  
    useEffect(() =>{
        loadFaceApiModels();
    }, [])

    const loadFaceApiModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      await faceapi.nets.ageGenderNet.loadFromUri('/models');
    };


   
    
      const handleResize = () => {
        setScreenDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
    
      useEffect(() => {
        // Add event listener to update dimensions on window resize
        window.addEventListener('resize', handleResize);
    
        // Cleanup the event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []); 


      console.log(screenDimensions.width)
   
    


    const handleDetection = async () =>{
      setIsDetecting(true)
      const detections =  await faceapi.detectAllFaces(imgUrl && imageRef.current,  new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks().withFaceExpressions()

      console.log(detections)

      if (canvasRef.current && imageRef.current) {
        const canvas = faceapi.createCanvasFromMedia(imageRef.current);
        canvasRef.current.innerHTML = '';
          canvasRef.current.appendChild(canvas);

          faceapi.matchDimensions(canvasRef.current, {
            width : screenDimensions.width > 460 ? 640: 440,
            height: screenDimensions.width > 460 ? 480 : 280
          })
          const resizedImage = faceapi.resizeResults(detections , {
            width : screenDimensions.width > 460 ? 640: 440,
            height: screenDimensions.width > 460 ? 480 : 280
          })
        faceapi.draw.drawDetections(canvasRef.current , resizedImage , )
        faceapi.draw.drawFaceExpressions(canvasRef.current , resizedImage )
        faceapi.draw.drawFaceLandmarks(canvasRef.current , resizedImage )

       } 

       setIsDetecting(false)

      }
      

    




  return (
    <div className={styles.ImageContainer} >
      <Link className={styles.link} href={"captureAnImage"}><ArrowBack/>Go Back</Link>
      <div className={styles.containerOne}>
        <img ref={imageRef} className={styles.image} src={imgUrl} height={screenDimensions.width > 460 ? 480 : 280} width={screenDimensions.width > 460 ? 640: 440} />
        <canvas ref={canvasRef}  className={styles.canvas} height={screenDimensions.width > 460 ? 480 : 280} width={screenDimensions.width > 460 ? 640: 440} />
      </div>
      <button onClick={handleDetection}>{isDetecting ? "Detecting.. ": <SearchSharp fontSize='large'/>}</button>
    </div>

  )
}

export default CapturedImage