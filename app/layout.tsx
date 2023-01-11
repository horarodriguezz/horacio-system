import "./globals.css";
import { Roboto } from "@next/font/google";

const poppins = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export default function RootLayout(rootLayoutProps: {
  children: React.ReactNode;
}) {
  const { children } = rootLayoutProps;

  return (
    <html lang='en' className={poppins.className}>
      <body className='overflow-hidden'>{children}</body>
    </html>
  );
}
