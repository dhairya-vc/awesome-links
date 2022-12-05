import { ApolloProvider } from "@apollo/client";

import "../styles/tailwind.css";
import Layout from "../components/Layout";
import apolloClient from "../lib/apollo";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
