import React, { useContext } from "react";
import style from "./HomeLeft.module.css";
import TwitterLogo from "@/components/common/svg/TwitterLogo";
import Button from "@/components/common/button/button";
// import { ModalContext } from '@/providers/ModalProvider'
import ProfilePill from "@/components/profilePill/ProfilePill";
import { useRouter } from "next/router";
import { MODAL_QUERY_POST } from "@/helper/constStrings";
import { useSession } from "next-auth/react";

export default function HomeLeft() {
  // const [ modal, setModal ] = useContext(ModalContext)
  const router = useRouter();
  const session = useSession();
  const onclick = () => {
    // modal.showPostEditor = true;
    // setModal({ ...modal })
    //

    router.push("/" + MODAL_QUERY_POST);
  };

  return (
    <section className={style.left}>
      <div>
        <div>
          <section>
            <TwitterLogo></TwitterLogo>
            <div className={style.logos}>
              <div
                onClick={() => {
                  router.push({
                    pathname: "/profile",
                    query: {
                      id: session.data.user.id,
                    },
                  });
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
                  </g>
                </svg>
                Profile
              </div>
              <div>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path>
                  </g>
                </svg>
                Settings
              </div>
            </div>
            {session.status == "authenticated" && (
              <Button onclick={onclick}></Button>
            )}
          </section>

          {session.status == "authenticated" && (
            <ProfilePill data={session.data.user}></ProfilePill>
          )}
        </div>
      </div>
    </section>
  );
}
