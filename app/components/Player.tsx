"use client"

import { useEffect, useRef, useState } from "react"
import { Episode, MediaDetail } from "@/app/types/media"

declare global {
  interface Window {
    jwplayer: any
  }
}

export default function PlayerTv({
  media,
  tmdb_id,
}: {
  media: MediaDetail,
  tmdb_id: string,
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  // State quản lý link hiện tại và loại player
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [isEmbed, setIsEmbed] = useState(false)
  
  // State hiển thị danh sách server
  const [showServerList, setShowServerList] = useState(false)

  // Khởi tạo link ban đầu khi vào trang
  useEffect(() => {
    const initLink = media.servers[0]?.server_data[0]?.link_m3u8;

    if (initLink) {
      setCurrentUrl(initLink)
      setIsEmbed(!initLink.endsWith(".m3u8"))
    }
  }, [media])

  // Xử lý JWPlayer (Chỉ chạy khi KHÔNG PHẢI là embed và có link m3u8)
  useEffect(() => {
    if (isEmbed || !currentUrl || !ref.current || !window.jwplayer) return

    // Clean up player cũ nếu có
    try {
      if (window.jwplayer(ref.current)) window.jwplayer(ref.current).remove();
    } catch {}

    const instance = window.jwplayer(ref.current)
    const STORAGE_KEY = `watchTime_${tmdb_id}`

    instance.setup({
      key: "ITWMv7t88JGzI0xPwW8I0+LveiXX9SWbfdmt0ArUSyc=",
      title: `Watching: ${media.name}`,
      file: currentUrl,
      width: "100%",
      image: media.backdrop,
      aspectratio: "16:9",
      playbackRateControls: true,
    })
    
    // Khôi phục thời gian xem
    instance.on("beforePlay", () => { 
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) instance.seek(parseFloat(saved)) 
    })

    instance.on("time", () => { 
      const pos = instance.getPosition() 
      localStorage.setItem(STORAGE_KEY, pos.toString()) 
    })

    instance.on("ready", () => {
      addSeekButtons(instance)
      
      // Thêm nút "Server" vào thanh điều khiển của JWPlayer
      // Khi bấm sẽ gọi React State để mở Overlay
      instance.addButton(
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xOS4zNSAxMC4wNEMxOC42NyA2LjU5IDE1LjY0IDQgMTIgNCA5LjExIDQgNi42IDYuMTIgNS42MyAxMC4wNCAyLjM0IDEwLjM2IDAgMTMuMTkgMCAxNnMzLjM1IDUuNjUgNy41IDUuNjVoOS44NWM0LjI4IDAgNy41LTMuNTggNy41LTdzLTMuOTUtNi44NS03LjU1LTYuODV6bS01Ljg1IDZMMTIgMTN2NGgtMnYtNGwtMS41IDEuNUw3IDE0LjVsNS01IDUgNS0xLjUgMS41eiIvPjwvc3ZnPg==",
        "Choose Server",
        () => setShowServerList(true), // Kích hoạt React State
        "serverButton"
      );
    })

    return () => {
      try {
        instance.remove()
      } catch {}
    }
  }, [currentUrl, isEmbed, tmdb_id, media])

  // Hàm helper thêm nút tua
  function addSeekButtons(playerInstance: any) {
    const playerContainer = playerInstance.getContainer()
    const buttonContainer = playerContainer.querySelector(".jw-button-container") as HTMLElement
    const rewindDisplay = playerContainer.querySelector(".jw-display-icon-rewind") as HTMLElement
    const nextDisplay = playerContainer.querySelector(".jw-display-icon-next") as HTMLElement

    if (!buttonContainer || !rewindDisplay) return

    // Display Icon (+10s)
    const forwardDisplay = rewindDisplay.cloneNode(true) as HTMLElement
    const forwardDisplayIcon = forwardDisplay.querySelector(".jw-icon-rewind") as HTMLElement
    forwardDisplayIcon.style.transform = "scaleX(-1)"
    forwardDisplayIcon.setAttribute("aria-label", "Forward 10 Seconds")
    forwardDisplay.onclick = () => playerInstance.seek(playerInstance.getPosition() + 10)
    nextDisplay?.parentNode?.insertBefore(forwardDisplay, nextDisplay)
    if (nextDisplay) nextDisplay.style.display = "none"

    // Control Bar (+10s)
    const rewindControl = buttonContainer.querySelector(".jw-icon-rewind") as HTMLElement
    if (!rewindControl) return
    const forwardControl = rewindControl.cloneNode(true) as HTMLElement
    forwardControl.style.transform = "scaleX(-1)"
    forwardControl.setAttribute("aria-label", "Forward 10 Seconds")
    forwardControl.onclick = () => playerInstance.seek(playerInstance.getPosition() + 10)
    rewindControl.parentNode?.insertBefore(forwardControl, rewindControl.nextElementSibling)
  }

  // Hàm đổi server
  const handleSelectServer = (link: string) => {
    if (link === currentUrl) return;
    
    const isNewLinkEmbed = !link.endsWith(".m3u8");
    setCurrentUrl(link);
    setIsEmbed(isNewLinkEmbed);
    setShowServerList(false);
  };

  return (
    <div className="player-page" style={{ position: "relative", width: "100%", height: "100%", aspectRatio: "16/9", background: "#000" }}>
      
      {/* === PHẦN HIỂN THỊ PLAYER === */}
      {isEmbed ? (
        <div className="jw-wrapper" style={{ width: "100%", height: "100%", position: "relative" }}>
           {/* Nút Server cho chế độ Embed (Vì iframe che mất mọi thứ nên cần nút nổi) */}
           <button 
              onClick={() => setShowServerList(true)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 10,
                background: "rgba(0,0,0,0.7)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
           >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 6.12 5.63 10.04 2.34 10.36 0 13.19 0 16s3.35 5.65 7.5 5.65h9.85c4.28 0 7.5-3.58 7.5-7s-3.95-6.85-7.55-6.85zm-5.85 6L12 13v4h-2v-4l-1.5 1.5L7 14.5l5-5 5 5-1.5 1.5z"/></svg>
             Server
           </button>
           <iframe src={currentUrl} allowFullScreen style={{ width: "100%", height: "100%", border: "none" }} /> 
        </div>
      ) : (
        <div ref={ref} className="jw-wrapper" />
      )}

      {/* === PHẦN OVERLAY DANH SÁCH SERVER (REACT UI) === */}
      {showServerList && (
        <div 
          className="jw-server-overlay jw-reset active"
          onClick={(e) => {
             // Đóng khi click ra ngoài panel
             if(e.target === e.currentTarget) setShowServerList(false)
          }}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div className="jw-server-panel" style={{ background: "#222", padding: "20px", borderRadius: "8px"}}>
            <div className="jw-server-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#fff", borderBottom: "1px solid #444", paddingBottom: "10px" }}>
              <span style={{ fontWeight: "bold" }}>Choose Server</span>
              <button 
                type="button" 
                onClick={() => setShowServerList(false)}
                style={{ background: "none", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            
            <ul className="jw-server-list" style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: "300px", overflowY: "auto" }}>
              {media.servers.map((server, idx) => {
                const link = server.server_data[0]?.link_m3u8;
                if (!link) return null;

                const isActive = link === currentUrl;

                return (
                  <li 
                    key={idx}
                    className={`jw-server-item ${isActive ? "current-server" : ""}`}
                    onClick={() => handleSelectServer(link)}
                    style={{
                      padding: "10px",
                      background: isActive ? "#d93025" : "#333",
                      color: "#fff",
                      marginBottom: "5px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                  >
                    {server.server_name}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}