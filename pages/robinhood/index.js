import Head from 'next/head';
import styles from 'css/Robinhood.module.css';
import { useState, useEffect } from 'react';

export default function Robinhood() {
  const [member_id, setMemberId] = useState('');
  const [userLoaded, setUserLoaded] = useState(false);
  const [homeClass, setHomeClass] = useState();

  useEffect(() => {
    (async () => {
      const userinfo_raw = await fetch('/api/oauth/userinfo');
      const userinfo = await userinfo_raw.json();
      setUserLoaded(true);
      setMemberId(userinfo.member_id);
      if (userinfo.member_id) {
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
        <a className={styles.registerLink} href="/robinhood/register">Register</a>
      </main>
      
    </div>
  )
}
