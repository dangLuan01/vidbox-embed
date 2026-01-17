import { Media } from "@/app/services/media"
import ClientPlayerTv from "@/app/components/ClientPlayerTv"

export default async function Movie({
  params,
}: {
  params: Promise<{ tmdb_id: string, season: string, episode: string }>
}) {
  const { tmdb_id, season, episode } = await params
  const service   = new Media()
  const data      = await service.getTvSlug(tmdb_id, season)
  //const subtitles = await service.getTvSubtitle(tmdb_id, season, episode)

  return <ClientPlayerTv 
          media={data} 
          tmdb_id={tmdb_id} 
          season={season} 
          episode={episode} 
        />
}
