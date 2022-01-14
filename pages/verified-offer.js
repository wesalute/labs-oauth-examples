import Head from 'next/head'
import styles from 'css/Amazon.module.css'
import router from 'next/router';
import { useEffect, useState } from 'react';

function Amazon({user_info}) {
  const basePath = router?.router?.basePath;
  const [member_id, setMemberId] = useState('');
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const userinfo_raw = await fetch(`${basePath}/api/oauth/userinfo?client_id=verified-offer`);
      const userinfo = await userinfo_raw.json();
      setUserLoaded(true);
      setMemberId(userinfo.memberId);
    })()
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Amazon Shopping</title>
        <meta name="description" content="Demo of WeSalute Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.connect}>
          {member_id ?
          <div className={styles.connected}>
            <div className={styles.headerText}>Connected to WeSalute Account {member_id}!</div>
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
  return userLoaded ? <a className={styles.headerText} href={`${basePath}/api/oauth/redirect?client_id=verified-offer&verify=1`}>Click here to redeem an offer exlusively for premium Verified WeSalute members</a> : null;
}

export default Amazon;