import './globals.css';

export const metadata = {
  title: 'Whatfix Valet Parking',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}