"use client"

import dynamic from "next/dynamic"
import { MediaDetail } from "@/app/types/media"

const JWPlayer = dynamic(
  () => import("@/app/components/PlayerTv"),
  { ssr: false }
)

export default function ClientPlayerTv({ media, tmdb_id, season, episode }: { 
  media: MediaDetail, tmdb_id: string, season: string, episode: string 
}) {
  return <JWPlayer media={media} tmdb_id={tmdb_id} season={season} episode={episode}/>
}