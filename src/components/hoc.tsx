import React, { useEffect, useState } from 'react';
import AuthHeader from './authHeader';
import useUser from './hooks/useUser';
import { useRouter } from 'next/router';

const withAuthLayout = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithAuthLayout: React.FC<P> = (props: P) => {
        const { isAuthenticated } = useUser();
        const router = useRouter();
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            if (!isAuthenticated) {
                router.push('/auth/login');
            } else {
                setLoading(false);
            }
        }, [isAuthenticated, router]);

        // Show a loading spinner or nothing while redirecting
        if (loading) {
            return <div>Loading...</div>;
        }

        return (
            <div className='bg-white'>
                <AuthHeader />
                <div className="flex-1 w-full max-w-7xl px-6 py-12">
                    <WrappedComponent {...props} />
                </div>
            </div>
        );
    };

    WithAuthLayout.displayName = `WithAuthLayout(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithAuthLayout;
};

export default withAuthLayout;
