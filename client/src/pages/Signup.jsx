import {useEffect, useState} from "react";
import emailValidator from "email-validator"
import {useNavigate} from "react-router-dom";

export default function Signup({server_host}) {

    useEffect(() => {document.title = 'Регистрация'}, [])
    const [user, setUser] = useState({email: '', password: ''})
    const [repeatPassword, setRepeatPassword] = useState('')
    const [message, setMessage] = useState('')
    const [disabled, setDisabled] = useState(false)

    const navigate = useNavigate()

    function changeUser(name, value) {
        setUser({
            ...user,
            [name]: value
        })
    }

    async function signUpHandler() {
        setDisabled(true)
        setMessage('')
        if(!user.email || !user.password || !repeatPassword) {
            setMessage('Заполните все поля')
            setDisabled(false)
            return
        }
        if (repeatPassword !== user.password) {
            setMessage('Пароли не совпадают')
            setDisabled(false)
            return
        }
        if (!emailValidator.validate(user.email)) {
            setMessage('Email неверный')
            setDisabled(false)
            return
        }

        // const res = await fetch('http://localhost:9001/users/signup', {
        const res = await fetch(server_host +'/users/signup', {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()

        if (data.ok) {
            setMessage('Регистрация прошла успешно. Вы будете перенаправлены в личный кабинет')
            navigate('/dashboard')
        } else {
            setDisabled(false)
            setMessage('Пользователь с тиким email уже зарегистрирован')
        }
    }

    return (
        <div>
            <h1 className={'signup-title'}>
                Регистрация
            </h1>
            <div className={'message'}>{message}</div>
                <form className={'signup-form'}>
                    <label>Email:
                        <input type={'text'} name={'email'} onChange={e => changeUser('email', e.target.value)} value={user.email}/>
                    </label>
                    <label>Пароль:
                        <input type={'password'} onChange={e => changeUser('password', e.target.value)} value={user.password}/>
                    </label>
                    <label>Пароль ещё раз:
                        <input type={'password'} name={'email'} onChange={e => setRepeatPassword(e.target.value)}/>
                    </label>
                    <button className={'button'} type={'button'} onClick={signUpHandler} disabled={disabled}>Зарегистрироваться</button>
                </form>
                <div className={'login-google-oauth-wrap'}>
                    <a className={'login-google-oauth'} href={'https://api.allspacex.ru/oauth/google'}>Войти через Google</a>
                </div>

        </div>
    )
}