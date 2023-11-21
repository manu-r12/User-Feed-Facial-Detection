import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Banner from '@/Componets/Banner/banner'
import NavBar from '@/Componets/NavBar/navabr'
import GreetingBox from '@/Componets/greeting/greetingBox'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <GreetingBox/>
        <NavBar/>
        <Banner/>
        <div className={styles.info}>
          <p> ⭐️ All the links in navbar are fake</p>
          <p>⭐️ This web application is a part of assesment task</p>
        </div>
      
     
      </main>
    </>
  )
}
