import { $host } from ".";

export const fetchObjects = async () => {
    const { data } = await $host.get('api/object/all')
    return data
}

export const fetchSummary = async () => {
    const { data } = await $host.get('api/step/summary')
    return data
}

export const createObject = async (name, floor) => {
    const { data } = await $host.post('api/object', { name, floor })
    return data
}

export const findObject = async (object_id) => {
    const { data } = await $host.get('api/object/one', { params: { object_id } })
    return data
}

export const deleteObject = async (object_id) => {
    const { data } = await $host.delete('api/object', { params: { object_id } })
    return data
}

export const findSteps = async (object_id) => {
    const { data } = await $host.get('api/step/forobject', { params: { object_id } })
    return data
}

export const findItems = async (step_id) => {
    const { data } = await $host.get('api/item/forstep', { params: { step_id } })
    return data
}

export const createItem = async (name, total, total_non_cash, paid_cash, paid_non_cash, step_id, is_work) => {
    const { data } = await $host.post('api/item', { name, total, total_non_cash, paid_cash, paid_non_cash, step_id, is_work })
    return data
}

export const createNew = async (name, total, total_non_cash, paid_cash, paid_non_cash, step_id, is_work, files) => {
    return new Promise(async (resolve, reject) => {
        try {
            await createItem(name, total, total_non_cash, paid_cash, paid_non_cash, step_id, is_work)
                .then(async (data) => {
                    let item_id = data.item_id
                    let file = files
                    const formData = new FormData()
                    formData.append('item_id', item_id)

                    for (let i of file) {
                        console.log(i)
                        formData.append('file', i)
                    }

                    for (let pair of formData.entries()) {
                        console.log(pair[0] + ', ' + pair[1]);
                    }

                    const { data: data2 } = await $host.post('api/file', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })

                    resolve(data2)
                })
        } catch (error) {
            reject(error)
        }
    })
}

export const getFiles = async (item_id) => {
    const { data } = await $host.get('api/file', { params: { item_id } })
    return data
}

export const createNewFiles = async (item_id, files) => {
    let file = files
    const formData = new FormData()
    formData.append('item_id', item_id)

    for (let i of file) {
        console.log(i)
        formData.append('file', i)
    }

    for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1])
    }

    const { data } = await $host.post('api/file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return data
}

export const createItemAll = async (name, total, total_non_cash, paid_cash, paid_non_cash, step_num, is_work) => {
    const { data } = await $host.post('api/item/forall', { name, total, total_non_cash, paid_cash, paid_non_cash, step_num, is_work })
    return data
}

export const createItemMany = async (name, total, total_non_cash, paid_cash, paid_non_cash, step_num, objects_arr, is_work) => {
    const { data } = await $host.post('api/item/forchosen', { name, total, total_non_cash, paid_cash, paid_non_cash, step_num, objects_arr, is_work })
    return data
}

export const updateItem = async (item_id, name, total, total_non_cash, paid_cash, paid_non_cash) => {
    const { data } = await $host.post('api/item/update', { item_id, name, total, total_non_cash, paid_cash, paid_non_cash })
    return data
}

export const deleteItem = async (item_id) => {
    const { data } = await $host.delete('api/item', { params: { item_id } })
    return data
}