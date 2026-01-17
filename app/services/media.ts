import { Episode, MediaDetail, Server, Subtitle } from "../types/media"

export class Media {
    private baseUrl: string
    private baseUrlSub: string
    private baseUrlOphim: string
    private baseUrlImage: string

    constructor(){
        this.baseUrl        = "https://watchapi.xoailac.top"
        this.baseUrlOphim   = "https://ophim1.com/v1/api/phim/"
        this.baseUrlImage   = "https://img.ophim.live/uploads/movies/"
        this.baseUrlSub     = "https://sub.wyzie.ru/search?"
    }

    private async request(url: string, endpoint: string) {
        try { 
            const res = await fetch(`${url}${endpoint}`, { 
                headers: { 
                    "X-API-KEY": `${process.env.API_KEY}`,
                },
                next: { revalidate: 600 }
            }) 

            if (!res.ok) {
                return
            }
            
            return await res.json() 
        } catch (error) { 
            console.error("API error:", error) 
            return null 
        }
    }

    async getMovieSlug(tmdb_id: string): Promise<MediaDetail> {
        const data = await this.request(this.baseUrl, `/api/v1/movie/${tmdb_id}`)
        const resp = await this.getStreamingWithSlug(data.results)

        return resp
    }

    async getTvSlug(tmdb_id: string, season: string): Promise<MediaDetail> {
        const data = await this.request(this.baseUrl, `/api/v1/tv/${tmdb_id}/${season}`)
        const resp = await this.getStreamingWithSlug(data.results)

        return resp
    }

    async getStreamingWithSlug(slug: string): Promise<MediaDetail> {
        const resp = await this.request(this.baseUrlOphim, slug)

        const safeData: MediaDetail = {
            name: resp.data.item.name,
            backdrop: this.baseUrlImage + resp.data.item.poster_url,
            servers: resp.data.item.episodes
        }

        return safeData as MediaDetail
    }

    async getTvSubtitle(tmdb_id: string, season: string, episode: string): Promise<Subtitle[]> {
        const resp = await this.request(this.baseUrlSub, `id=${tmdb_id}&season=${season}&episode=${episode}`)    
        const safeData: Subtitle[] = resp?.map((s: Subtitle) => ({
            file: s.url,
            label: s.display,
            kind: "captions",
            language: s.language
        }))
        
        return safeData as Subtitle[] || []
    }

    async getMovieSubtitle(tmdb_id: string): Promise<Subtitle[]> {
        const resp = await this.request(this.baseUrlSub, `id=${tmdb_id}`)    
        const safeData: Subtitle[] = resp?.map((s: Subtitle) => ({
            file: s.url,
            label: s.display,
            kind: "captions",
            language: s.language
        }))
        
        return safeData as Subtitle[] || []
    }
}