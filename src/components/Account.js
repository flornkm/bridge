import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Avatar from "./Avatar";

export default function Account({ session, setSettings, avatar_url, setAvatarUrl, avatar, setAvatar }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
    } catch (error) {
      console.error("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 bg-black bg-opacity-40 w-screen h-screen flex justify-center items-center px-[5%]">
      <div className="form-widget bg-white p-6 rounded-xl w-[550px] flex flex-col gap-4 relative z-20">
        <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
        <Avatar
          uid={user.id}
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url);
            console.log(url);
            updateProfile({ username, website, avatar_url: url });
          }}
          avatar={avatar}
          setAvatar={setAvatar}
        />
        <div className="w-full grid grid-cols-3 items-center">
          <label htmlFor="email" className="text-zinc-500">
            Email
          </label>
          <input
            id="email"
            type="text"
            className="w-full bg-zinc-100 rounded-lg p-2 col-span-2"
            value={session.user.email}
            disabled
          />
        </div>
        <div className="w-full grid grid-cols-3 items-center">
          <label htmlFor="username" className="text-zinc-500">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username || ""}
            className="w-full brdg-border rounded-lg p-2 col-span-2"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="w-full grid grid-cols-3 items-center">
          <label htmlFor="website" className="text-zinc-500">
            Website
          </label>
          <input
            id="website"
            type="website"
            value={website || ""}
            className="w-full brdg-border rounded-lg p-2 col-span-2"
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="w-full flex justify-left gap-4 mt-14">
          <div className="w-full">
            <button
              className="font-medium px-3 py-2 rounded-lg border border-zinc-200 bg-white text-black transition-all hover:bg-zinc-50 w-full"
              onClick={() => {
                setSettings(false);
              }}
              disabled={loading}
            >
              Done
            </button>
          </div>
          <div className="w-full">
            <button
              className="font-medium px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 w-full"
              onClick={() => updateProfile({ username, website, avatar_url })}
              disabled={loading}
            >
              {loading ? "Loading ..." : "Update Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
