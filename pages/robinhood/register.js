import Head from 'next/head';
import router from 'next/router';
import { publicRuntimeConfig } from 'next.config';
import styles from 'css/Robinhood.module.css'

export default function Robinhood() {
  const basePath = router?.router?.basePath || publicRuntimeConfig.basePath;

  return (
    <div className={styles.container}>
      <Head>
        <title>Login to WeSalute</title>
        <meta name="description" content="Demo of WeSalute Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.register} ${styles.background}`}>
        <a className={styles.login} href={`${basePath}/api/oauth/redirect?client_id=robinhood`}>Login With WeSalute</a>
      </main>

    </div>
  )
}
