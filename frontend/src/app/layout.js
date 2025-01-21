export const metadata = {
  title: 'SmartPlanner',
  logo: '/logo.png',  // Correct relative path for Next.js public folder
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={metadata.logo} type="image/png" />
        <title>{metadata.title}</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
