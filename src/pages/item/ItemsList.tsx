import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import './ItemsList.scss'
import {Item} from "../../types";
import {itemsAPI} from "../../api/api";

const ItemsList: React.FC = () => {
    const [items, setItems] = useState<Item[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [isTableLoading, setIsTableLoading] = useState<boolean>(true)
    const [sortField, setSortField] = useState<string>('')
    const [sortDirection, setSortDirection] = useState<string>('asc')
    const [activeSort, setActiveSort] = useState<{ [key: string]: string }>({})
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        id: '',
        last_name: '',
        name: '',
        middle_name: ''
    })
    const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({})

    const fetchData = async () => {
        setIsTableLoading(true)

        // Преобразуем фильтры для запроса
        const transformedFilters: any = { ...activeFilters }
        if (transformedFilters.id && transformedFilters.id.length > 0) {
            transformedFilters.id = transformedFilters.id.split(',')
        }

        const params: any = {
            current_page: currentPage,
            per_page: pageSize,
            ...activeSort,
            ...transformedFilters
        }
        try {
            const response = await itemsAPI.getItems(params)

            setIsTableLoading(false)
            setItems(response.data)
            setTotalPages(response.paginate.last_page)
            setTotalItems(response.paginate.total)
        } catch (e: any) {
            console.error(e)
        }

    }

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFilters(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }
    const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortField(e.target.value)
    }

    const handleSortDirectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortDirection(e.target.value)
    }

    const applyFiltersAndSort = () => {
        // Обновляем активные фильтры и сортировку
        setActiveFilters(filters)
        setActiveSort({
            [`sort[${sortField}]`]: sortDirection
        })
        setCurrentPage(1)
    }

    const previousPage = async () => {
        await setCurrentPage(currentPage - 1)
    }

    const nextPage = async () => {
        await setCurrentPage(currentPage + 1)
    }

    const changePageSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentPage(1)
        setPageSize(parseInt(event.target.value))
    }

    useEffect(() => {
        fetchData()
    }, [currentPage, pageSize, activeFilters, activeSort])


    return (
        <div className="itemsList">
            <h1>Items List</h1>
            <div>
                {isTableLoading && (
                    <div className="itemsLoading">
                        Loading...
                    </div>
                )}
                {!isTableLoading && (
                    <div className="itemsListContent">
                        <div className="filtersSortsSearch">
                            <div className="filters">
                                <label>ID:</label>
                                <input
                                    type="text"
                                    value={filters.id}
                                    onChange={(e) => handleFilterChange(e, 'id')}
                                />

                                {/* Фильтр по фамилии */}
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={filters.last_name}
                                    onChange={(e) => handleFilterChange(e, 'last_name')}
                                />

                                {/* Фильтр по имени */}
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={filters.name}
                                    onChange={(e) => handleFilterChange(e, 'name')}
                                />

                                {/* Фильтр по отчеству */}
                                <label>Middle Name:</label>
                                <input
                                    type="text"
                                    value={filters.middle_name}
                                    onChange={(e) => handleFilterChange(e, 'middle_name')}
                                />
                            </div>
                            <div className="sortsSearch">
                                <div className="sorts">
                                    {/* Селект для выбора поля сортировки */}
                                    <label>Sort by</label>
                                    <select value={sortField} onChange={handleSortFieldChange}>
                                        <option value="id">ID</option>
                                        <option value="last_name">Last Name</option>
                                        <option value="name">First Name</option>
                                        <option value="middle_name">Middle Name</option>
                                    </select>

                                    {/* Селект для выбора направления сортировки */}
                                    <label>Направление сортировки:</label>
                                    <select value={sortDirection} onChange={handleSortDirectionChange}>
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending </option>
                                    </select>
                                </div>
                                <div className="search">
                                    <button onClick={applyFiltersAndSort}>Search</button>
                                </div>
                            </div>

                        </div>

                        {totalItems > 0 && (
                            <div className="itemsListTable">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Last Name</th>
                                        <th>First Name</th>
                                        <th>Middle Name</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {items.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.last_name}</td>
                                            <td>{item.name}</td>
                                            <td>{item.middle_name}</td>
                                            <td>
                                                <div className="actions">
                                                    <Link to={`/view/${item.id}`}>👁</Link>
                                                    <Link to={`/edit/${item.id}`}>✎</Link>
                                                    <Link to={`/delete/${item.id}`}>🗑️</Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div className="pagination">
                                    <div className="paginationBlock">
                                        <button disabled={currentPage <= 1} onClick={previousPage}> {'<'} </button>
                                        <span>Page {currentPage} of {totalPages}</span>
                                        <button disabled={currentPage >= totalPages} onClick={nextPage}>{'>'}</button>
                                    </div>
                                    <div className="paginationBlock">
                                        <span>Total: {totalItems}</span>
                                        <span>
                                            <span>Page size: </span>
                                            <select value={pageSize} onChange={changePageSize}>
                                                <option value={1}>1</option>
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>
                                        </span>
                                    </div>

                                </div>
                            </div>

                        )}
                        {totalItems === 0 && (
                            <div className="itemsLoading">
                                No items found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ItemsList
