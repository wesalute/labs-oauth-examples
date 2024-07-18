import Head from 'next/head'
import styles from 'css/Cart.module.css'
import getConfig from 'next/config';
import router from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';

function Cart() {
  const { publicRuntimeConfig } = getConfig();
  const basePath = router?.router?.basePath || publicRuntimeConfig.basePath;
  const [userInfo, setUserInfo] = useState({});
  const [price, setPrice] = useState(262.94);
  const [discount, setDiscount] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(price);
  const [userLoaded, setUserLoaded] = useState(false);

  // Reset the user info state when the user disconnects
  const userDisconnect = () => {
    setUserInfo({});
  };

  useEffect(() => {
    (async () => {
      // Fetch the user info if it hasn't been loaded yet
      if (!userLoaded) {
        try {
          const response = await fetch(`${basePath}/api/oauth/userinfo?client_id=cart`);
          if (!response.ok) {
            throw new Error('Failed to fetch user info');
          }
          setUserLoaded(true); // Set userLoaded to true to prevent infinite loop

          const data = await response.json();
          data.member_id ? setUserInfo(data) : setUserInfo({}); // Set userInfo to the response data
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }

      // Calculate the discounted price based on user properties
      if (userInfo?.tier) {
        let discount = 0;
        if (userInfo.tier == 'basic') discount = 0.10; // Basic tier gets 10% discount
        if (userInfo.tier == 'premium') discount = 0.20; // Premium tier gets 20% discount
        let discountedPrice = Number(price * (1 - discount)).toFixed(2); // Calculate the discounted price
        setDiscount(discount);
        setDiscountedPrice(discountedPrice);
      } else {
        setDiscount(0);
        setDiscountedPrice(price);
      }
    })()
  }, [userLoaded, basePath, price, userInfo]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Checkout Your Cart</title>
        <meta name="description" content="Demo of WeSalute Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Checkout Your Cart</h1>

        <div className={styles.cartItem}>
          <Image src={`${basePath}/10.png`} alt="" width={100} height={110} />
          <div className={styles.productName}>10 pound Widget</div>
          <div className={styles.productQuantity}><input defaultValue="5" /></div>
          <div className={styles.price}>$39.99</div>
          <div className={styles.trash}>🗑</div>
        </div>

        <div className={styles.cartItem}>
          <Image src={`${basePath}/20.png`} alt="" width={100} height={110} />
          <div className={styles.productName}>20 pound Widget</div>
          <div className={styles.productQuantity}><input defaultValue="1" /></div>
          <div className={styles.price}>$59.99</div>
          <div className={styles.trash}>🗑</div>
        </div>

        <div className={styles.cartItem}>
          <Image src={`${basePath}/blue.png`} alt="" width={100} height={110} />
          <div className={styles.productName}>Blue Widget</div>
          <div className={styles.productQuantity}><input defaultValue="1" /></div>
          <div className={styles.price}>$3.00</div>
          <div className={styles.trash}>🗑</div>
        </div>
        <div className={styles.subtotal}>Subtotal: ${price}</div>
        <div className={styles.connect}>
          {userInfo.member_id ? <Disconnect userDisconnect={userDisconnect} /> : <Connect userLoaded={userLoaded} basePath={basePath} />}
        </div>
        <UserInfo userInfo={userInfo} />
        <FinalPrice price={price} discount={discount} discountedPrice={discountedPrice} />
      </main>
    </div>
  )
}

function Connect({ userLoaded, basePath }) {
  if (userLoaded) {
    return (
      <a href={`${basePath}/api/oauth/redirect?client_id=cart`}>Get Military Discount</a>
    );
  }
  // return <div>Loading...</div>;
  return null;
}

function Disconnect({ userDisconnect }) {
  const handleDisconnect = () => {
    // Drop the cookies that store the user's WeSalute information
    document.cookie = "cart_access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "cart_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "cart_wesalute_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    // Call the disconnect function to reset the user info state
    userDisconnect();
    console.log("User disconnected!");
  };

  return (
    <button className={styles.disconnectButton} onClick={handleDisconnect}>Disconnect WeSalute</button>
  );
}

const UserInfo = ({ userInfo }) => {
  if (userInfo.member_id) {
    return (
      <div className={styles.userInfo}>
        <div><strong>Member ID:</strong> {userInfo.member_id}</div>
        <div><strong>Name:</strong> {userInfo.name}</div>
        <div><strong>Email:</strong> {userInfo.email}</div>
        <div><strong>Tier:</strong> {userInfo.tier}</div>
        <div><strong>Audience:</strong> {userInfo.audience[0]}</div>
      </div>
    );
  }
  return null;
};

function FinalPrice({ price, discount, discountedPrice }) {

  if (discount === 0) {
    return (
      <div className={styles.total}>Total: ${price}</div>
    )
  }

  return (
    <div className={styles.discount}>
      <div className={styles.original}><strike>Total: ${price}</strike></div>
      <div className={styles.discountCallout}>Military Discount Applied (-{discount * 100}%)</div>
      <div className={styles.discountedPrice}>Total: ${discountedPrice}</div>
    </div>
  )
}

export default Cart;
