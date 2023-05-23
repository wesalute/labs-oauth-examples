import Head from 'next/head'
import styles from 'css/Cart.module.css'
import getConfig from 'next/config';
import router from 'next/router';
import { useEffect, useState } from 'react';

function Cart({ user_info }) {
  const { publicRuntimeConfig } = getConfig();
  const basePath = router?.router?.basePath || publicRuntimeConfig.basePath;
  const [member_id, setMemberId] = useState('');
  const [price, setPrice] = useState(262.94);
  const [discountedPrice, setDiscountedPrice] = useState(price);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const userinfo_raw = await fetch(`${basePath}/api/oauth/userinfo?client_id=cart`);
      const userinfo = await userinfo_raw.json();
      setUserLoaded(true);
      setMemberId(userinfo?.member_id);
      if (userinfo?.member_id) {
        let newPrice = Number(price * .9).toFixed(1).toLocaleString();
        setDiscountedPrice(newPrice);
      }
    })()
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Checkout Your Cart</title>
        <meta name="description" content="Demo of WeSalute Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Checkout Your Shopping Cart</h1>

        <div className={styles.cartItem}>
          <img src={`${basePath}/10.png`} />
          <div className={styles.productName}>10 pound Widget</div>
          <div className={styles.productQuantity}><input defaultValue="5" /></div>
          <div className={styles.price}>$39.99</div>
          <div className={styles.trash}>🗑</div>
        </div>

        <div className={styles.cartItem}>
          <img src={`${basePath}/20.png`} />
          <div className={styles.productName}>20 pound Widget</div>
          <div className={styles.productQuantity}><input defaultValue="1" /></div>
          <div className={styles.price}>$59.99</div>
          <div className={styles.trash}>🗑</div>
        </div>

        <div className={styles.cartItem}>
          <img src={`${basePath}/blue.png`} />
          <div className={styles.productName}>Blue Widget</div>
          <div className={styles.productQuantity}><input defaultValue="1" /></div>
          <div className={styles.price}>$3.00</div>
          <div className={styles.trash}>🗑</div>
        </div>
        <div className={styles.subtotal}>Subtotal: ${price}</div>
        <div className={styles.discount}>{member_id ? <div>Connected to WeSalute</div> : <Connect userLoaded={userLoaded} basePath={basePath} />}</div>
        {member_id ? <Discounted price={price} discountedPrice={discountedPrice} /> : <div className={styles.total}>Total: ${price}</div>}

      </main>
    </div>
  )
}

function Connect({ userLoaded, basePath }) {
  return userLoaded ? <a className={styles.headerText} href={`${basePath}/api/oauth/redirect?client_id=cart`}>Connect WeSalute</a> : null;
}

function Discounted({ price, discountedPrice }) {
  return (
    <div className={styles.discountAmount}>
      <div className={styles.original}><strike>Total: ${price}</strike></div>
      <div className={styles.discountCallout}>10% Military Discount Applied</div>
      <div className={styles.discountedPrice}>Total: ${discountedPrice}</div>
    </div>
  )
}

export default Cart;
