import React from 'react'
import styles from './styels.module.css'
import { useRef, useEffect , useState} from 'react'
import  {useDispatch, useSelector} from 'react-redux'
import { setImageURL } from '@/reducer/ImageReducer'
import { getImageURL } from '@/reducer/imageSelector'
import { useRouter } from 'next/router'
import { CameraAlt, NoPhotography } from '@mui/icons-material'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import FolderIcon from '@mui/icons-material/Folder';
 

const CaptureImage = () => {

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [opneWebCam, setOpenWebCam]= useState<boolean>(false)
  const [isPopOpen, setIsPopOpen]= useState<boolean>(false)
  const dispatch = useDispatch()
  const imgUrl = useSelector(getImageURL)
  const router = useRouter()

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initializeWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: opneWebCam });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    initializeWebcam();

  
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [opneWebCam]);

    const handleCapture = () =>{
        const video = videoRef.current!
        const canvas = canvasRef.current!
        const canvasContext = canvas.getContext('2d')

        canvas.width = video.width
        canvas.height = video.height

        canvasContext?.drawImage(video, 0, 0, video.width, video.height);
        const imageDataURL = canvas.toDataURL('image/png');
        dispatch(setImageURL(imageDataURL))
       
        setIsPopOpen(true)


    }

    const handleFileChange = (e: any) =>{
      const fileInput = e.target;
      const file = e.target.files[0];


      if(file){
        const newFile = new FileReader()
        newFile.onload = (e) => {
        const image = new Image();
        image.src = e.target?.result as string;

        image.onload = () => {
          const canvas = document.createElement('canvas');
          const maxImageSize = 500; // Set your desired maximum image size

          let width = image.width;
          let height = image.height;

          if (width > height && width > maxImageSize) {
            height *= maxImageSize / width;
            width = maxImageSize;
          } else if (height > maxImageSize) {
            width *= maxImageSize / height;
            height = maxImageSize;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(image, 0, 0, width, height);

            const resizedImageData = canvas.toDataURL('image/jpeg');
             dispatch(setImageURL(resizedImageData))
              setIsPopOpen(true)

              fileInput.value = '';


        }

  
      }
      newFile.readAsDataURL(file);
    }
  }


    const handleWebcam = () =>{
        setOpenWebCam(!opneWebCam)
    }

  



  return (
    <div className={styles.main} style={{margin: "0"}}>
        <div className={styles.Container}>
               
               {isPopOpen && <div className={styles.popUpContainer}>
                    <div className={styles.popBox}>
                        <h1>Your Image</h1>
                        <img src={imgUrl && imgUrl}  style={{objectFit: "contain"}}  className={styles.capturedImageInPopBox}alt="Captured" />
                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                            {<button className={styles.retakeButton} onClick={() => setIsPopOpen(false)}>Retake</button>}
                            {<button className={styles.selectButton} onClick={() => router.push("capturedImage")}>Next</button>}
                        </div>
                    </div>
                </div>}
                <div className={styles.subContainer}>
                    <div className={styles.webCamContainer}>
                        {!opneWebCam &&  <div className={styles.blankWebCamInterFace}>Webcam is off <NoPhotography fontSize='large'/></div>}
                        {opneWebCam && <video ref={videoRef} style={{borderRadius: '30px'}} autoPlay playsInline  className={styles.video}width={640} height={480}></video>}
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    </div>
                    <div className={styles.buttonContainer}>
                        {!opneWebCam && <h1>Ready to start?</h1>}
                        {opneWebCam && <h1>Webcam is live!</h1>}
                    <div className={styles.buttons}>
                        <button className={styles.startButton}  onClick={handleWebcam}>{opneWebCam ? <NoPhotography/> : <CameraAlt/> }</button>
                        {!opneWebCam && <>
                            <h1>Or Select from files</h1>
                            <label htmlFor='fileInput' style={{display: "flex", alignItems:"center", justifyContent:"center"}} className={styles.selectButton} ><FolderIcon/></label>
                            <input onChange={handleFileChange}  id='fileInput' type='file' style={{display: "none"}}/>
                        </> }
                        {opneWebCam && <button className={styles.selectButton} onClick={handleCapture}><CenterFocusStrongIcon/></button>}
                    </div>
                    </div>
            </div>
        
            </div>
    </div>
   
  )
}


export default CaptureImage;
