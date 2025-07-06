import Header from "@/components/headers/header";

const AuthLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="flex justify-center h-full py-12 items-center">
            <Header />
            {children}
        </div>
    );
}

export default AuthLayout;