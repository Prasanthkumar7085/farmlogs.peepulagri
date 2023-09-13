// pages/_document.tsx

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title>Peepul Agri</title>
            {/* Add your favicon link tag here */}
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="icon" type="image/png" href="/favicon.png" ></link>
            <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes='32x32'></link>
          {/* Additional head elements can be added here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;