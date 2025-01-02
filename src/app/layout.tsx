import Footer from "@/components/Footer";
import "./globals.css";

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
