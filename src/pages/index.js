import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../components/Account";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <div>
      {!session ? (
        <div className="w-screen h-screen flex">
          <div className="h-screen flex flex-col justify-center px-16 w-full max-w-2xl">
            <h1 className="text-2xl font-semibold mb-8">Access your account</h1>
            <Auth
              supabaseClient={supabase}
              theme="default"
              socialLayout="horizontal"
              providers={[]}
              appearance={{
                style: {
                  button: {
                    background: "black",
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    padding: "8px 12px",
                    fontWeight: "medium",
                  },
                  anchor: {
                    color: "black",
                    textDecoration: "none",
                    fontWeight: "medium",
                  },
                  container: { width: "100%", margin: "0 auto" },
                  label: { color: "#6B7280", marginBottom: "4px" },
                  input: {
                    minWidth: "300px",
                    margin: "none",
                    borderColor: "#E5E5E5",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "black",
                    letterSpacing: "0px",
                  },
                  message: {
                    color: "#f87171",
                    marginTop: "16px",
                    position: "absolute",
                    bottom: "48px",
                    padding: "8px 12px",
                    backgroundColor: "#fef2f2",
                    borderRadius: "8px",
                    border: "1px solid #fecaca",
                  },
                },
              }}
            />
          </div>
          <div className="bg-gray-100 h-screen w-full max-md:hidden" />
        </div>
      ) : (
        <Account session={session} />
      )}
    </div>
  );
};

export default Home;
