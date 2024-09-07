import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ItemEdit.scss'
import {Item} from "../../types";
import {itemsAPI} from "../../api/api";

const ItemEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [item, setItem] = useState<Item | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await itemsAPI.getItem(id)
                setItem(response.data)
            } catch (error) {
                console.error('Error fetching item', error)
            }
        }

        fetchItem()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setItem(prevState => prevState ? { ...prevState, [name]: value } : null)
    }

    const handleSave = async () => {
        if (!item) return

        // Создание объекта с изменяемыми полями
        const updatableFields: Partial<Item> = {
            name: item.name,
            last_name: item.last_name,
            middle_name: item.middle_name || '',
            date_of_birth: item.date_of_birth || '',
            phone: item.phone || '',
            email: item.email || '',
            country: item.country ? { ...item.country, name: item.country.name || '' } : undefined,
            region: item.region ? { ...item.region, name: item.region.name || '' } : undefined,
            city: item.city ? { ...item.city, name: item.city.name || '' } : undefined,
        }

        // Фильтрация данных перед отправкой: отправляем только те поля, которые изменились и не пустые
        const filteredData = Object.entries(updatableFields).reduce((acc, [key, value]) => {
            if (value !== null && value !== '') {
                // @ts-ignore
                acc[key] = value
            }
            return acc
        }, {} as Partial<Item>)

        try {
            await itemsAPI.updateItem(id, filteredData)
            navigate('/home')
        } catch (error) {
            console.error('Error updating item', error)
        }
    }

    if (!item) return <div>Loading...</div>

    return (
        <div className="itemEdit">
            <h1>Edit Item</h1>
            <div className="itemContent">
                <label>
                    First Name:
                    <input name="name" value={item.name} onChange={handleChange} />
                </label>
                <label>
                    Last Name:
                    <input name="last_name" value={item.last_name} onChange={handleChange} />
                </label>
                <label>
                    Middle Name:
                    <input name="middle_name" value={item.middle_name || ''} onChange={handleChange} />
                </label>
                <label>
                    Date of Birth:
                    <input name="date_of_birth" type="date" value={item.date_of_birth || ''} onChange={handleChange} />
                </label>
                <label>
                    Phone Number:
                    <input name="phone" value={item.phone} onChange={handleChange} />
                </label>
                <label>
                    Email:
                    <input name="email" type="email" value={item.email} onChange={handleChange} />
                </label>
                <label>
                    Country:
                    <input name="country" value={item.country.name} onChange={handleChange} />
                </label>
                <label>
                    Region:
                    <input name="region" value={item.region.name} onChange={handleChange} />
                </label>
                <label>
                    City:
                    <input name="city" value={item.city.name} onChange={handleChange} />
                </label>
                <div className="actions">
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default ItemEdit
