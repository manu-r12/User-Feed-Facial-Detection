import React, { useState } from 'react'
import styles from './box.module.css'
import { CloseRounded } from '@mui/icons-material'
const GreetingBox = () => {

    const [show , setShow] = useState<boolean>(true)
    const handleClick = () =>{
        setShow(false)
    }

  return (
    <>
         {show && <div className={styles.greeting}>
          <p className={styles.p}>Dear Mr. Chandra,</p>
          <p>I hope this message finds you well. I wanted to take a moment to express my sincere gratitude for the opportunity to work on the facial recognition web application project at MoodMe.</p>
          <p>I'm genuinely enthusiastic about the idea of contributing more to MoodMe. The company's commitment to creativity, expertise, and excellence resonates with my professional aspirations. The collaborative and forward-thinking atmosphere here aligns perfectly with what I've been looking for.

            I can't wait to continue making meaningful contributions to our shared goals. Thanks again for this amazing opportunity. I'm really looking forward to being part of the MoodMe team.</p>
            <p>Best Regards,</p>
            <p>Manu</p>
            <button onClick={handleClick}>Close <CloseRounded/></button>
        </div>}
    </>
  )
}

export default GreetingBox