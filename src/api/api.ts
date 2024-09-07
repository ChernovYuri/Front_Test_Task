import axios from 'axios'

export const instance = axios.create({
    baseURL: 'https://dev.api.lidofon.com/api/v1',
})
const token = localStorage.getItem('token')

export const authAPI = {
    authMe(login: string, password: string) {
        return instance.post<any>('/login', {login: login, password: password})
            .then(response => {
                return response.data
            }).catch((err) => {
                console.error(err)
            })
    }
}

export const itemsAPI = {
    getItem(id: string | undefined) {
        if (id) {
            return instance.get<any>(`/crm/employee/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            }).then(response => {
                return response.data
            }).catch((err) => {
                console.error(err)
                if (err.response.status === 401) {
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
            })
        }
    },

    getItems(params: { currentPage?: number } = {}) {
        return instance.get<any>('/crm/employee', {
            headers: { Authorization: `Bearer ${token}` },
            params,
        }).then(response => {
            return response.data
        }).catch((err) => {
            console.error(err)
            if (err.response.status === 401) {
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        })
    },

    deleteItem(id: string | undefined) {
        if (id) {
            return instance.delete<any>(`/crm/employee/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            })
        }
    },

    updateItem(id: string | undefined, data: any) {
        return instance.patch<any>(`/crm/employee/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        })
    },
};