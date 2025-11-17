import React, {useState, useEffect} from 'react'
import { useRoutes, Link } from 'react-router-dom'
import Login from './pages/Login'
import ReadItems from './pages/ReadItems'
import CreateItem from './pages/CreateItem'
import EditItem from './pages/EditItem'
import ItemDetails from './pages/ItemDetails'
import CreateRequest from './pages/CreateRequest'
import AddToWatchlist from './pages/AddToWatchlist'

const API_URL = 'http://localhost:3001'

// const response = await fetch(`${API_URL}/api/items`)

const App = () => {

     const [user, setUser] = useState(null)
     const [items, setItems] = useState([])
     const [requests, setRequests] = useState([])

     useEffect(() => {
         const getUser = async() => {
             const response = await fetch(`${API_URL}/auth/login/success`, {
                 credentials: 'include'
             })
             const json = await response.json()
             setUser(json.user)
         }


        const fetchItems = async () => {
            // Using API_URL constant before the endpoint
            const response = await fetch(`${API_URL}/api/items`)
            const data = await response.json()
            setItems(data)
        }

        const fetchRequests = async () => {
            const response = await fetch(`${API_URL}/api/requests`)
            const data = await response.json()
            setRequests(data)  
        }
        
        getUser()
        fetchItems()
        fetchRequests()
    }, [])

    let element = useRoutes([
        {
            path: '/',
            element: user && user.id ?
                <ReadItems user={user} data={items} api_url={API_URL} /> : 
                <Login api_url={API_URL} />
        },
        {
            path: '/item/new',
            element: user && user.id ?
                <CreateItem user={user} api_url={API_URL} /> : 
                <Login api_url={API_URL} />
        },
        {
            path: '/edit/:id', 
            element: user && user.id ?
                <EditItem user={user} data={items} api_url={API_URL} /> : 
                <Login api_url={API_URL} />
        },
        {
            path: '/item/:id',
            element: user && user.id ?
                <ItemDetails user={user} data={items} api_url={API_URL} /> : 
                <Login api_url={API_URL} />
        },
        {
            path: '/request/new',
            element: user && user.id ?
                <CreateRequest user={user} api_url={API_URL} /> : 
                <Login api_url={API_URL} />
        },
        {
            path: '/watchlist/add/:item_id',
            element: user && user.id ?
                <AddToWatchlist user={user} data={items} api_url={API_URL} /> : 
                <Login api_url={API_URL} />
        }
    ])


    return (
        <div className='App'>
            {
                user && user.id ?
                    <div className='header'>
                        <h1>Borrow Buddy 🤝</h1>
                        <Link to='/'><button className='headerBtn'>Browse Items</button></Link>
                        <Link to='/item/new'><button className='headerBtn'>+ List Item</button></Link>
                        <Link to='/request/new'><button className='headerBtn'>My Requests</button></Link>
                    </div>
                : <></>
            }
            {element}
        </div>
    )
}

export default App

