"use client";
import "./globals.css";
import { PrivyProvider } from "@privy-io/react-auth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
          config={{
            loginMethods: ["twitter"],
            appearance: {
              theme: "dark",
              accentColor: "#7b3cff",
            },
          }}
        >
          {children}
        </PrivyProvider>
      </body>
    </html>
  );
}
