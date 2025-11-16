import React from 'react'
import { userRoutes } from 'reat-router-dom'
import Login from './pages/Login'

const API_URL = 'http://localhost:3001'

const response = await fetch(`${API_URL}/api/items`)

const App = () => {

     const [user, setUser] = useState(null)
     const [items, setItems] = useState([])

     useEffect(() => {
        const fetchItems = async () => {
            // Using API_URL constant before the endpoint
            const response = await fetch(`${API_URL}/api/items`)
            const data = await response.json()
            setItems(data)
        }
        
        fetchItems()
    }, [])

    let element = useRoutes([
        {
            path: '/',
            element: <ReadItems user={user} data={items} api_url={API_URL} />
        },
        {
            path: '/item/new',
            element: <CreateItem user={user} api_url={API_URL} />
        },
        {
            path: '/edit/:id', 
            element: <EditItem user={user} data={items} api_url={API_URL} />
        },
        {
            path: '/item/:id',
            element: <ItemDetails user={user} data={items} api_url={API_URL} />
        },
        {
            path: '/request/new',
            element: <CreateRequest user={user} api_url={API_URL} />
        },
        {
            path: '/watchlist/add/:item_id',
            element: <AddToWatchlist user={user} data={items} api_url={API_URL} />
        }
    ])
    return (
        <div className='app'>
            <CreateItem user={user} data={items} api_url={API_URL} />
            <EditItem user={user} data={trips} api_url={API_URL} />
            <ItemDetails user={user} data={trips} api_url={API_URL} />
        
        </div>
    )
}

export default App

