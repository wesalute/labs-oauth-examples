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
        <p className={styles.intro}>The following pages show a variety of simulated experiences in which brands connect to WeSalute using OAuth. Using these pages, simulated consumers may connect their WeSalute account to simulated third parties.
        You may view and edit your connected brands on the <a href="https://account.veteransadvantage.com/account/data-privacy">brand connections manager.</a></p>

        <h2>Please Select Your Simulation:</h2>
        <ul>
          <li className={styles.listItem}><Link href="/amazon">Amazon</Link> - Connect your WeSalute account to a simulated amazon.com.</li>
          <li className={styles.listItem}><Link href="/starbucks">Starbucks</Link> - Connect your WeSalute account to a simulated starbucks.com.</li>
          <li className={styles.listItem}><Link href="/cart">Shopping Cart</Link> - Connect your WeSalute account during checkout at an online store.</li>
          <li className={styles.listItem}><Link href="/cart-client">Shopping Cart (client-side)</Link> - Connect your WeSalute account during checkout at an online store (without disrupting the purchase flow).</li>
          <li className={styles.listItem}><Link href="/robinhood">User Registration</Link> - "Login with WeSalute" to newly register on partner sites. Similar to "login with facebook" or "login with google."</li>
          <li className={styles.listItem}><Link href="/ourside">Ourside</Link> - Connect your WeSalute account to a partner website, starting from a link hosted outside of the partner website. Useful for hosting offer links on veteransadvantage.com, in email messages, or on marketing sites.</li>
          <li className={styles.listItem}><Link href="/upsell">Premium Required</Link> - Connect your WeSalute account to a simulated amazon.com, but first require upgrading to a paid Vet Rewards account.</li>
        </ul>
      </main>
      
    </div>
  )
}
