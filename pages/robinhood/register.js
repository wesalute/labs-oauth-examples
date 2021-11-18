import Head from 'next/head'
import styles from 'css/Robinhood.module.css'

export default function Robinhood() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login to WeSalute</title>
        <meta name="description" content="Demo of WeSalute Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.register} ${styles.background}`}>
        <a className={styles.login} href="/api/oauth/redirect?client_id=robinhood">Login With WeSalute</a>
      </main>
      
    </div>
  )
}
