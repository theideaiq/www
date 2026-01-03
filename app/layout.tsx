import "./globals.css";

// This is just a required shell. It passes control down to the inner layout.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // We default to "en" here just to satisfy the HTML tag requirement.
    // The inner layout will override this context visually.
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
