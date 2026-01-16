// app/movie/[tmdb_id]/page.tsx
import { Media } from "@/app/services/media"
import ClientPlayer from "@/app/components/ClientPlayer"

export default async function Movie({
  params,
}: {
  params: Promise<{ tmdb_id: string }>
}) {
  const { tmdb_id } = await params
  const service = new Media()
  const data = await service.getMovieSlug(tmdb_id)

  return <ClientPlayer media={data} tmdb_id={tmdb_id}/>
}
