"use client"

import { Title } from 'rizzui';
import Spinner from './spinner';

type LoaderProps = {
    showLoadingText?: boolean;
};

export default function Loader({ showLoadingText = true }: LoaderProps) {
    return (
        <div className="grid h-full min-h-[128px] flex-grow place-content-center items-center justify-center">
            <Spinner size="xl" />
            {showLoadingText ? (
                <Title as="h6" className="-me-2 mt-4 font-medium text-gray-500">
                    Loading...
                </Title>
            ) : null}
        </div>
    );
}
