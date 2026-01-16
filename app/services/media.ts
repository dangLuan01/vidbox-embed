import { Episode, MediaDetail, Server } from "../types/media"

export class Media {
    private baseUrl: string
    private baseUrlOphim: string
    private baseUrlImage: string

    constructor(){
        this.baseUrl        = "http://localhost:8080"
        this.baseUrlOphim   = "https://ophim1.com/v1/api/phim/"
        this.baseUrlImage   = "https://img.ophim.live/uploads/movies/"
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
                throw new Error(`Failed to fetch ${endpoint}`) 
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
}