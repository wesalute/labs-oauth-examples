import Head from 'next/head'
import styles from 'css/Cart.module.css'
import getConfig from 'next/config';
import router from 'next/router';
import { useEffect, useState } from 'react';
import Script from "next/script";
import Image from 'next/image';

function CartClient(props) {
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
    setDiscount(0);
    setDiscountedPrice(price);
  };

  useEffect(() => {
    (async () => {
      // Calculate the discounted price based on user properties
      if (userInfo?.tier) {
        let discount = 0;
        if (userInfo.tier == 'basic') discount = 0.20; // Basic tier gets 20% discount
        if (userInfo.tier == 'premium') discount = 0.30; // Premium tier gets 30% discount
        let discountedPrice = Number(price * (1 - discount)).toFixed(2); // Calculate the discounted price
        setDiscount(discount);
        setDiscountedPrice(discountedPrice);
      }
    })()
  }, [userInfo, price]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Checkout Your Cart</title>
        <meta name="description" content="Demo of WeSalute Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        src={props.widgetUrl}
        onReady={async () => {
          console.log("[debug]", props.widgetUrl, props.clientId)
          await initBrandConnections({
            client_id: `${props.clientId}`,
            size: "xs",
            // connectText: "Sign In",
            // disconnectText: "Sign Out",
            callback: function (data, error) {
              if (error) {
                console.log("error", error);
              } else if (data) {
                console.log("[data]", data);
                setUserInfo(data?.profile);
              }
            },
            // Called when user disconnects
            loggedOut: function () {
              userDisconnect();
              console.log("User disconnected!");
            }
          }, '#brand-connections-container');
        }}
      />
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
        <div className={styles.connect} id={"brand-connections-container"}></div>
        <UserInfo userInfo={userInfo} />
        <FinalPrice price={price} discount={discount} discountedPrice={discountedPrice} />
      </main>
    </div>
  )
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

export default CartClient;

export async function getServerSideProps(context) {
  const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
  const { query } = context;

  return {
    props: {
      widgetUrl: serverRuntimeConfig.widgetUrl,
      clientId: serverRuntimeConfig.clients.cart.id,
    },
  }
}
