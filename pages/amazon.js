import Head from 'next/head'
import styles from 'css/Amazon.module.css'
import { useEffect, useState } from 'react';

function Amazon({user_info}) {
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
          <Connect userLoaded={userLoaded}/>
          }
        </div>
      </main>
    </div>
  )
}

function Connect({userLoaded}) {
  return userLoaded ? <a className={styles.headerText} href="/api/oauth/redirect?client_id=amazon">Click here to connect your WeSalute account for a military discount</a> : null;
}

export default Amazon;