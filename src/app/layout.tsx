import Footer from "@/components/Footer";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    icons: {
        icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔗</text></svg>"
    }
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="w-vw h-screen bg-zinc-950 text-white font-mono m-0 p-0">
                {children}
                <Footer />
            </body>
        </html>
    );
}
