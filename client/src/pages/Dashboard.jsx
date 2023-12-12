import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Dashboard({server_host}) {

    useEffect(() => {document.title = 'Личный кабинет'}, [])
    const [loading, setLoading] = useState(true)
    const [needAuth, setNeedAuth] = useState(false)
    const [user, setUser] = useState({username: ''})
    const [message, setMessage] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [disabledInput, setDisabledInput] = useState(true)


    useEffect(() => {
        (async () => {
            await checkAuth()
        })()
    }, [])

    const navigate = useNavigate()

    async function checkAuth() {
        const res = await fetch(server_host + '/users/check/auth', {
            method: 'post',
            credentials: 'include',
        })
        const data = await res.json()

        if (data.ok) {
            setLoading(false)
            await loadData()
        } else {
            setNeedAuth(true)
            setLoading(false)
        }
    }

    async function loadData() {
        const res = await fetch(server_host + '/users/me/', {
            method: 'get',
            credentials: 'include',
        })
        const data = await res.json()

        if (data.ok) {
            setUser(data.user)
        }
    }

    if (loading) {
        return (
            <div>
                <h3>Загрузка...</h3>
            </div>
        )
    }

    if (needAuth) {
        return (
            <div>
                <h4 className={'login-title'}>Необходимо авторизоваться...</h4>
                {navigate('/login')}
            </div>
        )
    }

    function changeUser(name, value) {
        setUser({
            ...user,
            [name]: value
        })
    }

    async function save() {
        setDisabled(true)
        setMessage('')
        const res = await fetch(server_host + '/users/update', {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()
        setDisabled(false)
        setDisabledInput(true)

        if (data.ok) {
            setMessage('Имя пользователя изменно')
            setTimeout(() => {setMessage('')},3000)
        } else {
            setMessage('Ошибка сохранения')
        }
    }

    function changeDisabledInput(e) {
        e.preventDefault()
        setDisabledInput(false)
    }

    return (
        <div>
            <h1>
                Личный кабинет
            </h1>
            <div>{message}</div>
            <form className={'dashboard-form'}>
                <label>Username:
                    <input className={disabledInput === false ? 'dashboard-form__input_disabled-false' : 'dashboard-form__input_disabled-true'}
                           type={'text'}
                           value={user.username}
                           disabled={disabledInput}
                           onChange={e => changeUser('username', e.target.value)} />
                </label>
                <button onClick={changeDisabledInput} disabled={disabled}>Изменить</button>
                <button onClick={save} disabled={disabled}>Сохранить</button>
            </form>
        </div>
    )
}