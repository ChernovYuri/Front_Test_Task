export interface Item {
    id: string
    int_id: number
    login: string
    last_name: string
    name: string
    middle_name: string | null
    full_name: string
    date_of_birth: string | null
    call_number: string | null
    virtual_number: string | null
    phone: string
    email: string
    city: Location
    region: Location
    country: Location
    role: Role
    is_blocked: boolean
    links: Links
}

interface Location {
    id: string
    int_id: number
    name: string
    links: {
        view: Link
    }
}

interface Role {
    id: string
    int_id: number
    name: string
    permissions: Record<string, boolean>
    default_page: string
    updated: boolean
    deleted: boolean
    links: {
        view: Link
    }
}

interface Link {
    url: string
    title: string
    method: string
    permission_key: string
}

interface Links {
    view: Link
    restore: Link
    update: Link
    delete_soft: Link
    delete_hard: Link
}