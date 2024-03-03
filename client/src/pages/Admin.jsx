import {useEffect, useState} from "react";

export default function Admin({server_host}) {

    useEffect(() => {document.title = 'Админ панель'}, [])
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
                Админ кабинет
            </h1>
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Пароль</th>
                        <th>Роль</th>
                        <th>Управление</th>
                        <th>Danger Zone</th>
                    </tr>
                    </thead>
                    <tbody>
                        {users.map(user => <tr key={Math.random()}>
                            <td key={Math.random()}>{user.email}</td>
                            <td key={Math.random()}>{user.password}</td>
                            <td key={Math.random()}>{user.role}</td>
                            <td key={Math.random()}><button>Edit</button></td>
                            <td key={Math.random()}><button>Delete user</button></td>
                        </tr>)}

                    </tbody>
                </table>
            </div>
        </div>
    )
}