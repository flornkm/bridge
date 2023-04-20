import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import {
    useUser,
    useSupabaseClient,
    useSession,
  } from '@supabase/auth-helpers-react';
import Manage from '@/components/Manage';


export default function Published() {
    const supabase = useSupabaseClient();
    const session = useSession();
    const user = useUser();
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Manage your canditates - Bridge</title>
                <meta
                    name="description"
                    content="Bridge is a tool that allows you to create interactive elements for your website."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta
                    property="og:title"
                    content="Bridge is a tool that allows you to create interactive elements for your website."
                />
                <meta
                    property="og:description"
                    content="Bridge is a tool that allows you to create interactive elements for your website."
                />
                <meta
                    property="og:image"
                    content="/images/bridge_opengraph.jpg"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@floriandwt" />
                <meta name="twitter:title" content="Florian Portfolio" />
                <meta
                    name="twitter:image"
                    content="/images/bridge_twitter.jpg"
                />
                <meta
                    name="twitter:description"
                    content="Bridge is a tool that allows you to create interactive elements for your website."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="h-full w-full bg-white overflow-hidden">
                <div className="max-md:w-[90%] min-h-screen w-full max-w-7xl md:pl-[10%] md:pr-[10%] m-auto pb-16 bg-white pt-24">
                    <div className="flex justify-center items-center">
                        <Manage id={router.query.id} session={session} supabase={supabase} />
                    </div>
                </div>
            </main>
        </>
    )
}
