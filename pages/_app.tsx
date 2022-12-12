import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
// import { UserProvider } from "@auth0/nextjs-auth0/client";

import "../styles/tailwind.css";
import Layout from "../components/Layout";
import apolloClient from "../lib/apollo";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    // <UserProvider>
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </SessionProvider>
    // </UserProvider>
  );
}

export default MyApp;
