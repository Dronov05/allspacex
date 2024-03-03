import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";

export default function Menu({server_host}){

    const [loading, setLoading] = useState(true)
    const [authorised, setAuthorised] = useState(null)
    const [role, setRole] = useState(null)

    useEffect(() => {
        (async () => {
            await checkAuth()
        })()
    }, [])

    async function checkAuth() {
        const res = await fetch(server_host + '/users/check/auth', {
            method: 'post',
            credentials: 'include',
        })
        const data = await res.json()

        if (data.ok) {
            setLoading(false)
            setAuthorised(true)
            setRole(data.role)
        } else {
            setLoading(false)
        }
    }

    return (
        <div className={'menu'}>
            <span><NavLink to={'/'}>Главная</NavLink></span>
            {authorised && <span><NavLink to={'/users'}>Люди</NavLink></span>}
            {authorised && <span><NavLink to={'/ads/category/all'}>Объявления</NavLink></span>}
            {!authorised && <span><NavLink to={'/login'}>Вход</NavLink></span>}
            {authorised && <span><NavLink to={'/dashboard'}>Кабинет</NavLink></span>}
            {!authorised && <span><NavLink to={'/signup'}>Регистрация</NavLink></span>}
            {role === 'admin' && <span><NavLink to={'/admin'}>Админ</NavLink></span>}
            {role === 'admin' && <span><NavLink to={'/orders'}>Заказы</NavLink></span>}
            {authorised && <span><a href={server_host + '/users/logout'}>Выход</a></span>}
        </div>
    )
}