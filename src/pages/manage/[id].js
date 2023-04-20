import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  useUser,
  useSupabaseClient,
  useSession,
} from '@supabase/auth-helpers-react';
import Manage from '@/components/Manage';
import * as Icon from "phosphor-react";

export default function Published() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();
  const router = useRouter();
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  async function getProfile() {
    try {
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setAvatarUrl(data.avatar_url);
        if (data.avatar_url) {
          downloadImage(data.avatar_url);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatar(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }

  useEffect(() => {
    getProfile();
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

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

      <div className="h-full w-full bg-white overflow-hidden">
        <div className="w-full bg-white py-6 fixed top-0 border-b border-b-neutral-200 z-10">
          <div className="max-w-[80%] w-full mx-auto justify-between flex items-center">
            <div className="flex gap-10 items-center">
              <div
                className="flex gap-2 items-center cursor-pointer transition-all hover:opacity-80"
                onClick={() => router.push("/dashboard")}
              >
                <Icon.ArrowLeft size={20} weight="bold" />{" "}
                <h1 className="text-lg font-medium">Dashboard</h1>
              </div>
            </div>
           {session && router.query.id && <Link target="_blank" href={"/" + session.user.id + router.query.id.replace(session.user.id, '')} className="px-4 truncate py-2 text-gray-600 hover:text-black bg-white ring-1 ring-neutral-200 rounded-xl flex gap-2 items-center max-2xl:absolute max-2xl:top-24 max-2xl:left-[50%] max-2xl:translate-x-[-50%] max-w-screen">
                <Icon.Link size={20} />
                {"bridge.supply/" + session.user.id + router.query.id.replace(session.user.id, '')}
              </Link>}
            <div className="flex gap-6 items-stretch relative">
              <div className="bg-neutral-100 ring-1 ring-neutral-200 rounded-full">
                {!avatar ? (
                  <Icon.User size={40} className="p-2" />
                ) : (
                  <Image
                    src={avatar}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[80%] min-h-screen mx-auto justify-center flex items-center bg-white pt-24 pb-40">
          <Manage id={router.query.id} session={session} supabase={supabase} />
        </div>
      </div>
    </>
  )
}
