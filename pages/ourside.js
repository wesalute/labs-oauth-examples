import Head from 'next/head';
import styles from 'css/WeSalute.module.css';
import router from 'next/router';
import { publicRuntimeConfig } from 'next.config';
import { useEffect, useState } from 'react';

function Ourside({user_info}) {
  const basePath = router?.router?.basePath || publicRuntimeConfig.basePath;
  const [member_id, setMemberId] = useState('');
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const userinfo_raw = await fetch(`${basePath}/api/oauth/userinfo?client_id=ourside`);
      const userinfo = await userinfo_raw.json();
      setUserLoaded(true);
      setMemberId(userinfo?.member_id);
    })()
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Ourside</title>
        <meta name="description" content="Demo of WeSalute Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.connect}>
          {member_id ?
          <div className={styles.connected}>
            <div className={styles.redeemedText}><span>Offer Redeemed</span></div>
          </div>
          :
          <Connect userLoaded={userLoaded} basePath={basePath}/>
          }
        </div>
      </main>
    </div>
  )
}

function Connect({userLoaded, basePath}) {
  return userLoaded ? <a className={styles.unredeemedText} href={`${basePath}/api/oauth/redirect?client_id=ourside`}>Military Discount</a> : null;
}

export default Ourside;
