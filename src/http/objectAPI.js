import { $host } from ".";

export const fetchObjects = async () => {
    const { data } = await $host.get('api/object/all')
    return data
}

export const fetchSummary = async () => {
    const { data } = await $host.get('api/step/summary')
    console.log(data)
    return data
}

export const createObject = async (name) => {
    const { data } = await $host.post('api/object', { name })
    return data
}