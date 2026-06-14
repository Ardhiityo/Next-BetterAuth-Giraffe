"use client";

import { useSearchParams } from "next/navigation";

export default function Error() {
    const searchParams = useSearchParams();

    const error = searchParams.get('error')

    return (
        <>
            <h1>Ups, Something went wrong : {error}</h1>
        </>
    )
}