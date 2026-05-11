import "./globals.css";
import LayoutWrapper from "../components/layout/LayoutWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-linear-to-r from-gray-50 to-white text-gray-900">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
