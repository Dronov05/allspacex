import {useEffect, useState} from "react";
import User from "../components/User";

export default function Users({server_host}) {

    const [users, setUsers] = useState([])
    const [params, setParams] = useState({name: '', about: '', minAge: 0, maxAge: 100})

    useEffect(loadUsers, [])

    function loadUsers() {
        // fetch('http://localhost:9001/users/get/all',{
        fetch( server_host + '/users/get/all',{
            method: 'get',
            credentials: 'include',
        }).then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setUsers(data.users)
                }
            })
    }

    function search(name,value) {
        const updatedParams = {
            ...params,
            [name]: value
        }

        setParams(updatedParams)

        fetch(server_host + '/users/search?about=' + updatedParams.about + "&name=" + updatedParams.name
            + "&minAge=" + updatedParams.minAge
            + "&maxAge=" + updatedParams.maxAge, {
            method: 'get',
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data.ok) {
                setUsers(data.users)
            }
        })
    }

    return (
        <div>
            <h1>
                Пользователи
            </h1>
            <div className={'search-block'}>
                <form>
                    <input type={"text"} placeholder={"name"} onChange={e => search('name', e.target.value)} />&nbsp;
                    <input type={"text"} placeholder={"about"} onChange={e => search('about', e.target.value)} />&nbsp;
                    <input type={"number"} placeholder={"min-age"} onChange={e => search('minAge', e.target.value)} />-
                    <input type={"number"}  placeholder={"max-age"} onChange={e => search('maxAge', e.target.value)} />
                </form>
            </div>
            <div>{users.map(user => <User server_host={server_host} user={user} key={user._id} />)}</div>
        </div>
    )
}