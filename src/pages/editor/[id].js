import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  useUser,
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import * as Icon from "phosphor-react";
import CookieBanner from "@/components/CookieBanner";

export default function Editor(props) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);

  const router = useRouter();

  const fetchProjects = async (id, projectId) => {
    const res = await fetch(
      "/api/projects?user_id=" + id + "&project_id=" + projectId
    );
    const data = await res.json();
    setProject(data);
    setLoading(false);
  };

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
        setUsername(data.username);
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

  useEffect(() => {
    if (router.query.id) {
      fetchProjects(session.user.id, router.query.id.replace(user.id, ""));
    }
  }, [router.query.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    !loading &&
    project && (
      <div className="w-screen h-screen bg-neutral-50 bg-[url('/images/editor/canvas.svg')] bg-cover bg-center">
        <div className="w-full bg-white py-6 fixed top-0 border-b border-b-neutral-200">
          <div className="max-w-[80%] w-full mx-auto justify-between flex items-center">
            <div className="flex gap-10 items-center">
              <div
                className="flex gap-2 items-center cursor-pointer transition-all hover:opacity-80"
                onClick={() => router.push("/dashboard")}
              >
                <Icon.ArrowLeft size={20} weight="bold" />{" "}
                <h1 className="text-lg font-medium">Dashboard</h1>
              </div>
              <div className="flex gap-6">
                <Icon.ArrowArcLeft
                  size={20}
                  weight="bold"
                  className="cursor-pointer transition-all hover:opacity-80"
                />
                <Icon.ArrowArcRight
                  size={20}
                  weight="bold"
                  className="cursor-pointer transition-all hover:opacity-80"
                />
              </div>
            </div>
            <div className="flex gap-6 items-stretch">
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
              <div className="w-[1px] bg-neutral-200" />
              <button className="font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center">
                <Icon.UploadSimple size={20} weight="bold" />
                Export
              </button>
            </div>
          </div>
        </div>
        {project && project.elements.type === "cookie-banner" && (
          <CookieBanner
            data={project.elements}
            session={session}
            id={router.query.id}
          />
        )}
        <div className="p-6 bg-white ring-1 ring-neutral-200 rounded-full absolute bottom-24 flex gap-4 left-[50%] translate-x-[-50%] items-stretch">
          <button className="font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center">
            <Icon.Plus size={20} weight="bold" />
            Add
          </button>
          <div className="w-[1px] bg-neutral-200" />
          <div className="flex">
          <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center transition-all hover:opacity-80">
            <Icon.Drop size={20} weight="bold" />
            Colors
          </button>
          <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center transition-all hover:opacity-80">
            <Icon.LineSegment size={20} weight="bold" />
            Animation
          </button>
          <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center transition-all hover:opacity-80">
            <Icon.Confetti size={20} weight="bold" />
            Effects
          </button>
          </div>
        </div>
      </div>
    )
  );
}
