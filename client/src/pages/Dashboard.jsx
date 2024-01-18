import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Gallery from "../components/Gallery";

export default function Dashboard({server_host}) {

    useEffect(() => {document.title = 'Личный кабинет'}, [])
    const [loading, setLoading] = useState(true)
    const [needAuth, setNeedAuth] = useState(false)
    const [user, setUser] = useState({username: ''})
    const [message, setMessage] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [disabledInput, setDisabledInput] = useState(true)
    const [files, setFiles] = useState([])
    const [progress, setProgress] = useState()


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

    function submitAvatar(e) {
        setMessage('')
        e.preventDefault()

        let formData = new FormData()
        formData.append('file', files[0])

        axios.post(server_host + "/files/upload", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: data => {
                setProgress(Math.floor((100 * data.loaded) / data.total))
                if (data.loaded === data.total) {
                    document.location.reload()
                }
            }
        }).catch(e => {
            setMessage('Ошибка ' + e.response.status)
        })
    }

    return (
        <div>
            <h1>
                Личный кабинет
            </h1>
            <form className={'dashboard-form'}>
                <div className={'dashboard-form__label-wrap'}>
                    <label htmlFor={'username'}>Username:</label>
                    <input
                        className={disabledInput === false ? 'dashboard-form__input_disabled-false' : 'dashboard-form__input_disabled-true'}
                        type={'text'}
                        value={user.username}
                        disabled={disabledInput}
                        id={'username'}
                        onChange={e => changeUser('username', e.target.value)}/>
                </div>
                <div className={'dashboard-form__label-wrap'}>
                    <label htmlFor={'name'}>Имя:</label>
                    <input
                        className={disabledInput === false ? 'dashboard-form__input_disabled-false' : 'dashboard-form__input_disabled-true'}
                        type={'text'}
                        value={user.name}
                        disabled={disabledInput}
                        id={'name'}
                        onChange={e => changeUser('name', e.target.value)}/>
                </div>
                <div className={'dashboard-form__label-wrap'}>
                    <label htmlFor={'birthday'}>Дата рождения</label>
                    <input
                        className={disabledInput === false ? 'dashboard-form__input_disabled-false' : 'dashboard-form__input_disabled-true'}
                        type={'date'}
                        value={user.birthday}
                        disabled={disabledInput}
                        id={'birthday'}
                        onChange={e => changeUser('birthday', e.target.value)}/>
                </div>
                <div className={'dashboard-form__label-wrap'}>
                    <label htmlFor={'about'}>О себе</label>
                    <textarea
                        className={disabledInput === false ? 'dashboard-form__input_disabled-false' : 'dashboard-form__input_disabled-true'}
                        value={user.about}
                        disabled={disabledInput}
                        id={'about'}
                        onChange={e => changeUser('about', e.target.value)}/>
                </div>

                <button onClick={changeDisabledInput} disabled={disabled}>Изменить</button>
                <button onClick={save} disabled={disabled}>Сохранить</button>
            </form>
            <div className={'dashboard-form__label-wrap dashboard__load-files'}>
                <form onSubmit={submitAvatar}>
                    <label htmlFor={'loadFiles'}>Аватар </label>
                    <input
                        className={disabledInput === false ? 'dashboard-form__input_disabled-false' : 'dashboard-form__input_disabled-true'}
                        type={'file'}
                        id={'loadFiles'}
                        onChange={e => setFiles(e.target.files)}
                    />
                    <div className={'dashboard__load-files-button'}>
                        <button disabled={files.length === 0}>Загрузить</button>
                    </div>
                </form>
                {progress && progress + "%"}
            </div>
            {/*{JSON.stringify(user.files)}*/}
            {user.files &&  <Gallery server_host={server_host} user={user} />}
            <div>{message}</div>
        </div>
    )
}