import Head from 'next/head'
import styles from 'css/Starbucks.module.css'
import { useEffect, useState } from 'react';

function Starbucks({user_info}) {
  const [member_id, setMemberId] = useState('');
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const userinfo_raw = await fetch('/api/oauth/userinfo');
      const userinfo = await userinfo_raw.json();
      setUserLoaded(true);
      setMemberId(userinfo.member_id);
    })()
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Starbucks Coffee</title>
        <meta name="description" content="Demo of WeSalute Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.connect}>
          {member_id ?
          <div className={styles.connected}>
            <div className={styles.headerText}>Thank you for your service</div>
          </div>
          :
          <Connect userLoaded={userLoaded}/>
          }
        </div>
      </main>
    </div>
  )
}

function Connect({userLoaded}) {
  return userLoaded ? <a className={styles.headerText} href="/api/oauth/redirect?client_id=starbucks">Military Discount</a> : null;
}

export default Starbucks;