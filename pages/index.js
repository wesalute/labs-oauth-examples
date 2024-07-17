import Head from 'next/head'
import Link from 'next/link';
import styles from 'css/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login to WeSalute</title>
        <meta name="description" content="Demo of WeSalute Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <p className={styles.intro}>The following pages show a variety of simulated experiences in which brands connect to WeSalute using OAuth. Using these pages, simulated consumers may connect their WeSalute account to simulated third parties.</p>
        <p className={styles.intro}>View and edit your connected brands in the <a href="https://account.wesalute.com/brand-connections">Connected Apps & Accounts</a> section of the user account.</p>

        <h2>Please Select Your Simulation:</h2>
        <ul>
          <li className={styles.listItem}><Link href="/amazon">Amazon</Link> - Connect your WeSalute account to a simulated amazon.com.</li>
          <li className={styles.listItem}><Link href="/starbucks">Starbucks</Link> - Connect your WeSalute account to a simulated starbucks.com.</li>
          <li className={styles.listItem}><Link href="/cart">Shopping Cart</Link> - Connect your WeSalute account during checkout at an online store.</li>
          <li className={styles.listItem}><Link href="/cart-client">Shopping Cart (client-side)</Link> - Connect your WeSalute account during checkout at an online store.</li>
          <li className={styles.listItem}><Link href="/widget.html">Widget (client-side)</Link> - Barebones HTML example. Intended to be used as a starting point for your own client-side implementation.</li>
          <li className={styles.listItem}><Link href="/pkce-flow.html">PKCE flow (client-side)</Link> - Barebones HTML example of the OAuth PKCE client-side flow.</li>
        </ul>
      </main>

    </div>
  )
}
