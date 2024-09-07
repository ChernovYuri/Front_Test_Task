import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ItemDelete.scss'
import {itemsAPI} from "../../api/api";


const ItemDelete: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [item, setItem] = useState<{ id: number; name: string; last_name: string; middle_name: string } | null>(null)
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

    const handleDelete = async () => {
        try {
            await itemsAPI.deleteItem(id)
            navigate('/')
        } catch (error) {
            console.error('Error deleting item', error)
        }
    }

    if (!item) return <div>Loading...</div>

    return (
        <div className="itemDelete">
            <h1>Delete item</h1>
            <h2>Are you sure you want to delete the following item?</h2>
            <div className="itemContent">
                <div>ID: {item.id}</div>
                <div>First Name: {item.name}</div>
                <div>Last Name: {item.last_name}</div>
                {item.middle_name && (
                    <div>Middle Name: {item.middle_name}</div>
                )}
                <div className="actions">
                    <span>
                        <button onClick={handleDelete}>Confirm</button>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ItemDelete
