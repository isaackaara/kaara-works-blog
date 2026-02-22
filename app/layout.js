export const metadata = {
  title: 'Kaara Works Blog',
  description: 'AI transformation in East Africa',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
