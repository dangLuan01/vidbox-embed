import { notFound } from "next/navigation";
import { Episode, Info, MediaDetail, Server, Subtitle } from "../types/media"

export class Media {
    private baseUrl: string
    private baseUrlSub: string
    private baseUrlOphim: string
    private baseUrlKKphim: string
    private baseUrlApi: string

    constructor(){
        this.baseUrlApi     = "https://api.themoviedb.org/3"
        this.baseUrl        = "https://watchapi.xoailac.top"
        this.baseUrlOphim   = "https://ophim1.com/v1/api/phim/"
        this.baseUrlKKphim  = "https://phimapi.com/phim/"
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

    private async requestTmdb(url: string, endpoint: string) {
        try { 
            const res = await fetch(`${url}${endpoint}?api_key=${process.env.API_TMDB}&language=en-US`, { 
                headers: { 
                    // "X-API-KEY": `${process.env.API_KEY}`,
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

    private parseEpisodeSlug(slug: string): string {
        const number = slug.match(/\d+/g)?.join('')
        return number ? String(Number(number)) : slug
    }

    async getMediaInfo(tmdb_id: string, media_type: string): Promise<Info> {
        const data  = await this.requestTmdb(this.baseUrlApi, `/${media_type}/${tmdb_id}`)
        const safeData: Info = {
            name: data.title ? data.title : data.name,
            backdrop: data.backdrop_path
        }

        return safeData as Info
    }

    async getMovieSlug(tmdb_id: string): Promise<MediaDetail> {
        const infoPromise   = this.getMediaInfo(tmdb_id, "movie")
        const dataPromise   = this.request(this.baseUrl, `/api/v1/movie/${tmdb_id}`)
        const [info, data]  = await Promise.all([infoPromise, dataPromise])
        if (!data) {
            notFound()
        }

        const ophimData     = data.results.ophim_slug ?
        await this.getStreamingOphimWithSlug(data.results.ophim_slug) : []
        const kkphimData    = data.results.kkphim_slug ? 
        await this.getStreamingKKphimWithSlug(data.results.kkphim_slug) : []

        return {
            name: (await info).name,
            backdrop:'https://image.tmdb.org/t/p/original' + (await info).backdrop,
            servers: [
                ...ophimData,
                ...kkphimData
            ]
        }
    }

    async getTvSlug(tmdb_id: string, season: string): Promise<MediaDetail> {
        const infoPromise  = this.getMediaInfo(tmdb_id, "tv")
        const dataPromise  = this.request(this.baseUrl, `/api/v1/tv/${tmdb_id}/${season}`)
        const [info, data] = await Promise.all([infoPromise, dataPromise])
        
        if (!data) {
            notFound()
        }

        const ophimData     = data.results.ophim_slug ?
        await this.getStreamingOphimWithSlug(data.results.ophim_slug) : []
        const kkphimData    = data.results.kkphim_slug ? 
        await this.getStreamingKKphimWithSlug(data.results.kkphim_slug) : []

        return {
            name: (await info).name,
            backdrop:'https://image.tmdb.org/t/p/original' + (await info).backdrop,
            servers: [
                ...ophimData,
                ...kkphimData
            ]
        }
    }

    async getStreamingOphimWithSlug(slug: string): Promise<Server[]> {
        const resp = await this.request(this.baseUrlOphim, slug)
        
        const safeData: Server[] = resp.data.item.episodes.map((s: Server) =>({
            server_name: s.server_name,
            server_data: s.server_data.map((ep: Episode) => ({
                ...ep,
                slug: this.parseEpisodeSlug(ep.slug)
            }))
        })) 

        return safeData as Server[] || []
    }

    async getStreamingKKphimWithSlug(slug: string): Promise<Server[]> {
        const resp = await this.request(this.baseUrlKKphim, slug)
        
        const safeData: Server[] = resp.episodes.map((s: Server) => ({
            server_name: s.server_name,
            server_data: s.server_data.map((ep: Episode) => ({
                ...ep,
                slug: this.parseEpisodeSlug(ep.slug)
            }))
        }))
        
        return safeData as Server[] || []
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