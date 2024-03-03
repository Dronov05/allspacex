import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Photo from "../components/Photo";
import axios from "axios";

export default function CreateEditAdPage({server_host}) {

    const params = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState(params.id ? 'Редактирование объявления' : 'Создание объявления')
    const [ad, setAd] = useState({})
    const [progress, setProgress] = useState()
    const [message, setMessage] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!params.id) {
            createAdDraft().then(data => {
                console.log(data)
                const _id = data.ad._id
                navigate("/ads/edit/" + _id)
                setAd(ad)
                setLoading(false)
            })
        } else {
            loadAd()
        }
    }, [loading])

    function changeAd(key, value) {

        setMessage('')
        setDisabled(false)

        if (key === 'price') {
            setAd({
                ...ad,
                [key]: parseInt(value)
            })
            return
        }

        if (key === 'images') {
            setAd({
                ...ad,
                [key]: ad.images ? ad.images.concat({_id: value}) : [{_id: value}]
            })
            return;
        }

        setAd({
            ...ad,
            [key] : value
        })
    }

     async function saveAd() {
        setMessage('')
        setDisabled(true)

        if (ad.category === 'no' || !ad.category) {
            setMessage('Выберите категорию')
            setDisabled(false)
            return
        }

        try {
            const res = await fetch(server_host + "/ads/update", {
                method: 'post',
                credentials: 'include',
                body: JSON.stringify(ad),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json()
            if (data.ok) {
                setMessage('Сохранено')
            } else {
                setMessage('Не сохранено')
                setDisabled(false)
            }
        } catch (e) {
            console.error('Ошибка ' + e)
            setDisabled(false)
        }
    }

    function deleteAd() {
        setDisabled(true)
        fetch(server_host + '/ads/delete', {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify(ad),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data.ok) {
                setMessage('Удалено, сейчас вы будете переадресованы')
                setTimeout(() => {
                    navigate('/dashboard')
                }, 2000)
            } else {
                setMessage('Не удалено')
                setDisabled(false)
            }
        }).catch(e => {
            setMessage('Ошибка ' + e)
        })
    }

    function uploadImage(file, input) {
        setDisabled(true)

        let formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'ad')
        formData.append('id', ad._id)

        axios.post(server_host + "/files/upload", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: data => {
                setProgress(Math.floor((100 * data.loaded) / data.total))
                if (data.loaded === data.total) {
                    setDisabled(false)
                    input.value = null
                    // document.location.reload()
                }
            }
        }).then(res => {
            changeAd('images', res.data._id)
        }).catch(e => {
            setMessage('Ошибка ' + e.response.status)
        })
    }


    function loadAd() {
        fetch(server_host + "/ads/id/" + params.id, {
            credentials: "include"
        }).then(res => {
            return res.json()
        }).then(data => {
            setAd(data.ad)
            setLoading(false)
        })
    }

    function createAdDraft() {
        return fetch(server_host + "/ads/save", {
            method: "post",
            credentials: "include",
            body: JSON.stringify({title: "Черновик " + Date.now()}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res.json()
        }).catch(e =>  {
            console.error(e)
        })
    }

    if (loading) {
        return (
            <div>
                <h3>Загрузка...</h3>
            </div>
        )
    }

    return (
        <div>
            <h1>{title}</h1>
            <div>{message}</div>
            <div>
                <form className={'ad-form'}>
                    <div>
                        <span>Заголовок</span>
                        <div><input type={'text'} onChange={(e) => changeAd('title', e.target.value)} value={ad.title} /></div>
                    </div>
                    <div>
                        <span>Текст</span>
                        <div><input type={'text'} onChange={(e) => changeAd('text', e.target.value)} value={ad.text} /></div>
                    </div>
                    <div>
                        <span>Категория</span>
                        <div>
                            <select onChange={e => changeAd('category', e.target.value)} defaultValue={ad.category ? ad.category : 'no'}>
                                <option value={'no'} disabled={true}>Выберите</option>
                                <option value={'auto'}>Авто</option>
                                <option value={'properties'}>Недвижимость</option>
                                <option value={'services'}>Услуги</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <span>Цена</span>
                        <div><input type={'number'} onChange={e => changeAd('price', e.target.value)} value={ad.price} /></div>
                    </div>
                    <div>
                        <input type={'checkbox'} value={ad.published} onChange={e => changeAd('published', e.target.checked)} /> локазывать на сайте
                    </div>
                    <div>
                        <span>Изображения</span>
                        <div><input type={'file'} disabled={disabled} onChange={e => uploadImage(e.target.files[0])} /></div>
                    </div>
                    <div>{progress && progress + '%'}</div>
                    <div className={'ads-gallery'}>
                        {ad.images && ad.images.map(img => <Photo key={img} server_host={server_host} user={user} file={img}/>)}
                    </div>
                    <div className={'asd-save-delete-button'}>
                        <button onClick={saveAd} type={'button'} disabled={disabled}>Сохранить</button>&nbsp;
                        <button onClick={deleteAd} type={'button'} disabled={disabled}>Удалить объявление</button>
                    </div>
                </form>
            </div>
        </div>
    )
}