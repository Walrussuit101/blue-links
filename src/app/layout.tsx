import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="w-screen h-screen bg-zinc-950 text-white font-mono m-0 p-0 overflow-hidden">
                {children}
            </body>
        </html>
    );
}
