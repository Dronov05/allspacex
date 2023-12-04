import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Login({server_host}) {

    const [user, setUser] = useState({email: '', password: ''})
    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    async function login() {
        setMessage('')
        if (!user.email || !user.password) {
            setMessage('Заполните все поля')
        }

        const  res = await fetch('https://api.allspacex.ru/users/login', {
        // const  res = await fetch( server_host +'/users/login', {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()

        if (data.ok) {
            setMessage('Сейчас будет выполнена переадресация')
            navigate('/dashboard')
        } else {
            setMessage('Неверный логин или пароль')
        }
    }

    function changeUser(name, value) {
        setUser({
            ...user,
            [name]: value
        })
    }

    return (
        <div>
            <h1 className={'login-title'}>
                Вход
            </h1>
            <div className={'message'}>{message}</div>
            <form className={'login-form'}>
                <label>
                    <input type={"text"} name={'email'} placeholder={'Введите email'} onChange={e => changeUser('email', e.target.value)} value={user.email} />
                </label>
                <label>
                    <input type={"password"} placeholder={'Пароль'} onChange={e => changeUser('password', e.target.value)} value={user.password} />
                </label>
                <button className={'button'} type={'button'} onClick={login}>Войти</button>
            </form>
        </div>
    )
}