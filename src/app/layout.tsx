import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-black text-white font-mono m-0 p-0 overflow-x-hidden">
                {children}
            </body>
        </html>
    );
}
