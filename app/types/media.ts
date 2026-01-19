export interface MediaDetail {
    name: string,
    backdrop: string,
    servers: Server[] | []
}

export interface Info {
    name: string,
    backdrop: string,
}

export interface Server {
    server_name: string,
    server_data: Episode[]
}

export interface Episode {
    name: string,
    slug: string,
    filename: string,
    link_m3u8: string
}

export interface Subtitle {
    url: string,
    display: string,
    kind: string,
    language: string
}

