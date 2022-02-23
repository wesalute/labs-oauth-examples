import Head from 'next/head';
import styles from 'css/Robinhood.module.css';
import router from 'next/router';
import { publicRuntimeConfig } from 'next.config';
import { useState, useEffect } from 'react';

export default function Robinhood() {
  const basePath = router?.router?.basePath || publicRuntimeConfig.basePath;
  const [homeClass, setHomeClass] = useState();

  useEffect(() => {
    (async () => {
      const userinfo_raw = await fetch(`${basePath}/api/oauth/userinfo?client_id=robinhood`);
      const userinfo = await userinfo_raw.json();
      if (userinfo && userinfo?.data?.member_id) {
        setHomeClass(styles.logged)
      }
      else {
        setHomeClass(styles.home)
      }
    })()
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Login to WeSalute</title>
        <meta name="description" content="Demo of WeSalute Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${homeClass} ${styles.background}`}>
        <a className={styles.registerLink} href={`${basePath}/robinhood/register`}>Register</a>
      </main>
      
    </div>
  )
}
