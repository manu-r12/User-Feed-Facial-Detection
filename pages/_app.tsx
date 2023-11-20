import store from '@/store/store'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import NextTopLoader from 'nextjs-toploader';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Provider store={store}>
        <NextTopLoader  color='black'/>
        <Component {...pageProps} />
    </Provider>
    </>
  )
}
