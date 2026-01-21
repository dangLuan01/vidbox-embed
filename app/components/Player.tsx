"use client"

import { useEffect, useRef } from "react"
import { MediaDetail, Subtitle } from "@/app/types/media"

declare global {
  interface Window {
    jwplayer: any
  }
}

export default function Player({ media, tmdb_id }: { media: MediaDetail, tmdb_id: string }) {
  const ref = useRef<HTMLDivElement>(null)  
  
  useEffect(() => {
    if (!ref.current || !window.jwplayer) return

    const instance = window.jwplayer(ref.current)
    const STORAGE_KEY = `watchTime_${tmdb_id}`

    instance.setup({
      key: "ITWMv7t88JGzI0xPwW8I0+LveiXX9SWbfdmt0ArUSyc=",
      title: media.name,
      file: media.servers[0].server_data[0].link_m3u8,
      width: "100%",
      image: media.backdrop,
      aspectratio: "16:9",
      //stretching: "fill",
      playbackRateControls: true,
      
      //tracks: subtitles
    })

    instance.on("beforePlay", () => { 
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) { 
        instance.seek(parseFloat(saved)) 
      } 
    })

    instance.on("time", () => { 
      const pos = instance.getPosition() 
      localStorage.setItem(STORAGE_KEY, pos.toString()) 
    })

    instance.on("ready", () => {
      addSeekButtons(instance);
      
      const container = instance.getContainer();

      if (container.querySelector(".jw-server-overlay")) return;

      const overlay = document.createElement("div");
      overlay.className = "jw-server-overlay jw-reset"; 
      overlay.innerHTML = `
        <div class="jw-server-panel">
          <div class="jw-server-header">
            <span>Choose Server</span>
            <button class="jw-server-close" type="button">×</button>
          </div>
          <ul class="jw-server-list"></ul>
        </div>
      `;
      container.appendChild(overlay);

      const list = overlay.querySelector(".jw-server-list")!;
      let currentFile = media.servers[0].server_data[0].link_m3u8;

      const renderList = () => {
        list.innerHTML = "";
        media.servers.forEach((server) => {
          const link = server.server_data[0].link_m3u8;
          const li = document.createElement("li");
          li.className = "jw-server-item";
          
          if (link === currentFile) {
            li.classList.add("current-server");
          }

          li.innerText = server.server_name;
          
          li.onclick = () => {
            if (link !== currentFile) {
              currentFile = link;

              instance.load([{
                title: media.name,
                file: link,
                playbackRateControls: true,
              }]);

              instance.play();              
            }
            overlay.classList.remove("active");
            renderList();
          };
          
          list.appendChild(li);
        });
      };

      renderList();

      overlay.querySelector(".jw-server-close")!.addEventListener("click", () => {
        overlay.classList.remove("active");
      });

      // Sự kiện click ra ngoài thì đóng
      overlay.addEventListener("click", (e: any) => {
        if (e.target === overlay) {
          overlay.classList.remove("active");
        }
      });

      // Thêm nút vào thanh điều khiển
      instance.addButton(
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xOS4zNSAxMC4wNEMxOC42NyA2LjU5IDE1LjY0IDQgMTIgNCA5LjExIDQgNi42IDYuMTIgNS42MyAxMC4wNCAyLjM0IDEwLjM2IDAgMTMuMTkgMCAxNnMzLjM1IDUuNjUgNy41IDUuNjVoOS44NWM0LjI4IDAgNy41LTMuNTggNy41LTdzLTMuOTUtNi44NS03LjU1LTYuODV6bS01Ljg1IDZMMTIgMTN2NGgtMnYtNGwtMS41IDEuNUw3IDE0LjVsNS01IDUgNS0xLjUgMS41eiIvPjwvc3ZnPg==",
        "Choose Server",
        () => overlay.classList.toggle("active"),
        "serverButton"
      );
    });

    return () => {
      try { instance.remove() } catch {}
    }
  }, [media])
  function addSeekButtons(playerInstance: any) {
    const playerContainer = playerInstance.getContainer()

    const buttonContainer =
      playerContainer.querySelector(".jw-button-container") as HTMLElement
    const rewindDisplay =
      playerContainer.querySelector(".jw-display-icon-rewind") as HTMLElement
    const nextDisplay =
      playerContainer.querySelector(".jw-display-icon-next") as HTMLElement

    if (!buttonContainer || !rewindDisplay) return

    /* ========= DISPLAY ICON (+10s) ========= */
    const forwardDisplay = rewindDisplay.cloneNode(true) as HTMLElement
    const forwardDisplayIcon =
      forwardDisplay.querySelector(".jw-icon-rewind") as HTMLElement

    forwardDisplayIcon.style.transform = "scaleX(-1)"
    forwardDisplayIcon.setAttribute("aria-label", "Forward 10 Seconds")

    forwardDisplay.onclick = () => {
      playerInstance.seek(playerInstance.getPosition() + 10)
    }

    nextDisplay?.parentNode?.insertBefore(forwardDisplay, nextDisplay)
    if (nextDisplay) nextDisplay.style.display = "none"

    /* ========= CONTROL BAR (+10s) ========= */
    const rewindControl =
      buttonContainer.querySelector(".jw-icon-rewind") as HTMLElement
    if (!rewindControl) return

    const forwardControl = rewindControl.cloneNode(true) as HTMLElement
    forwardControl.style.transform = "scaleX(-1)"
    forwardControl.setAttribute("aria-label", "Forward 10 Seconds")

    forwardControl.onclick = () => {
      playerInstance.seek(playerInstance.getPosition() + 10)
    }

    rewindControl.parentNode?.insertBefore(
      forwardControl,
      rewindControl.nextElementSibling
    )
  }


  return (
    <div>
      <div ref={ref} className="jw-wrapper" />
    </div>
  )
}
