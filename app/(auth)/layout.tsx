const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="flex justify-items-center align-center">
            {children}
        </div>

    );
}

export default Layout;