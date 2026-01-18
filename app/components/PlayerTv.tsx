"use client"

import { useEffect, useRef } from "react"
import { Episode, MediaDetail, Subtitle } from "@/app/types/media"

declare global {
  interface Window {
    jwplayer: any
  }
}

export default function PlayerTv({
  media,
  tmdb_id,
  season,
  episode,
}: {
  media: MediaDetail,
  tmdb_id: string,
  season: string,
  episode: string,
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!ref.current || !window.jwplayer) return

    const instance = window.jwplayer(ref.current)

    const currentEp = media.servers[0].server_data.find(
      (e: Episode) => e.slug === episode
    )

    const STORAGE_KEY = `watchTime_${tmdb_id}_${season}_${episode}`

    instance.setup({
      key: "ITWMv7t88JGzI0xPwW8I0+LveiXX9SWbfdmt0ArUSyc=",
      title: media.name + " / (E" + episode +")",
      file: currentEp?.link_m3u8,
      width: "100%",
      image: media.backdrop,
      //stretching: "fill",
      aspectratio: "16:9",
      playbackRateControls: true,
      //tracks: subtitles,
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
      addSeekButtons(instance)
      const container = instance.getContainer()

      /* ========= OVERLAY ========= */
      const overlay = document.createElement("div")
      overlay.id = "jw-server-overlay"
      overlay.innerHTML = `
        <div class="jw-server-panel">
          <div class="jw-server-header">
            <span>Choose server</span>
            <button class="jw-server-close">✕</button>
          </div>
          <div class="jw-server-list"></div>
        </div>
      `
      container.appendChild(overlay)

      const list = overlay.querySelector(".jw-server-list")!

      /* ========= SERVER LIST ========= */
      media.servers.forEach(server => {
        const ep = server.server_data.find(
          (e: Episode) => e.slug === episode
        )
        if (!ep) return

        const item = document.createElement("div")
        item.className = "jw-server-item"
        item.innerText = server.server_name

        item.onclick = () => {
          instance.load([{ 
            file: ep.link_m3u8,
            playbackRateControls: true,
            //stretching: "fill",
            //tracks: subtitles,
          }])
          instance.play()
          overlay.classList.remove("active")
        }

        list.appendChild(item)
      })

      /* ========= CLOSE ========= */
      overlay
        .querySelector(".jw-server-close")!
        .addEventListener("click", () => {
          overlay.classList.remove("active")
        })

      /* ========= BUTTON ========= */
      instance.addButton(
        "/cloud.png",
        "Choose server",
        () => overlay.classList.toggle("active"),
        "serverButton"
      )
    })

    return () => {
      try {
        instance.remove()
      } catch {}
    }
  }, [media, episode])

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
    <div className="player-page" style={{ position: "relative" }}>
      <div ref={ref} className="jw-wrapper" />
    </div>
  )
}
