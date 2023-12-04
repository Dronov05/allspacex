import {useEffect, useState} from "react";
import {logDOM} from "@testing-library/react";

export default function Users({server_host}) {

    const [users, setUsers] = useState([])

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

    return (
        <div>
            <h1>
                Пользователи
            </h1>
            <div>{JSON.stringify(users)}</div>
        </div>
    )
}