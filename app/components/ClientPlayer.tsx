"use client"

import dynamic from "next/dynamic"
import { MediaDetail, Subtitle } from "@/app/types/media"

const JWPlayer = dynamic(
  () => import("@/app/components/Player"),
  { ssr: false }
)

export default function ClientPlayer({ media, tmdb_id }: { media: MediaDetail, tmdb_id: string }) {
  return <JWPlayer media={media} tmdb_id={tmdb_id} />
}
