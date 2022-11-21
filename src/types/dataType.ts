const RES_DATA_TYPE = {
    LIST: 0,
    OBJECT: 1,
}

interface RequestParams<T> {
    ws: String
    query: String
    params: T
}

export { RES_DATA_TYPE }

export type { RequestParams }
