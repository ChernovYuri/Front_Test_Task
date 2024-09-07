import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './ItemView.scss'
import {Item} from "../../types";
import {itemsAPI} from "../../api/api";

const ItemPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const [item, setItem] = useState<Item | null>(null)

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

    if (!item) return <div>Loading...</div>

    return (
        <div className="itemView">
            <h1>{item.full_name.trim()}</h1>
            <div className="itemContent">
                <p>ID: {item.id}</p>
                <p>First Name: {item.name}</p>
                <p>Last Name: {item.last_name}</p>
                {item.middle_name && (
                    <p>Middle Name: {item.middle_name}</p>
                )}
                {item.date_of_birth && (
                    <p>Date of birth: {item.date_of_birth}</p>
                )}
                {item.country.name && (
                    <p>Country: {item.country.name}</p>
                )}
                {item.region.name && (
                    <p>Region: {item.region.name}</p>
                )}
                {item.city.name && (
                    <p>City: {item.city.name}</p>
                )}
                {item.email && (
                    <p>e-mail: {item.email}</p>
                )}
                {item.phone && (
                    <p>Phone number: {item.phone}</p>
                )}
                {item.middle_name && (
                    <p>Middle Name: {item.middle_name}</p>
                )}
            </div>
        </div>
    )
}

export default ItemPage
