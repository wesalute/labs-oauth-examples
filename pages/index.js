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

        <h2>Please Select Your Simulation:</h2>
        <ul>
          <li><Link href="http://amazon.localhost:4000/amazon">Amazon</Link></li>
          <li><Link href="http://starbucks.localhost:4000/starbucks">Starbucks</Link></li>
          <li><Link href="http://cart.localhost:4000/cart">Generic Shopping Cart</Link></li>
          <li><Link href="http://robinhood.localhost:4000/robinhood">User Registration</Link></li>
          <li><Link href="/upsell">Upsell</Link></li>
        </ul>
      </main>
      
    </div>
  )
}
