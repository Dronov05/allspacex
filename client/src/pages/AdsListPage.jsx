import {NavLink, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Ad from "../components/Ad";

export default function AdsListPage({server_host}) {

    useEffect(() => {document.title = 'Объявления'}, [])

    const params = useParams()

    const [ads, setAds] = useState([])
    const [h1, setH1] = useState('Объявления')
    const [categoryFromState, setCategoryFromState] = useState('all')
    const [message, setMessage] = useState('')
    const [disabled, setDisabled] = useState(true)
    const [showNoMore, setShowNoMore] = useState(false)

    useEffect(defineTitle, [params])
    useEffect(() => {
        loadAds()
    }, [params])

    function loadAds(category) {
        setDisabled(true)
        category = category ? category : categoryFromState
        const url = server_host + '/ads/category/' + category  + '?skip=' + ads.length
        fetch(url, {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data.ok) {
                setAds(ads.concat(data.ads))
                setDisabled(false)
                if (data.ads.length === 0) {
                    setShowNoMore(true)
                }
            } else {
                setMessage('Ошибка загрузки объявлений')
            }
        }).catch(e => {
            setMessage('Ошибка загрузки объявлений' + e)
        })
    }

    function defineTitle(category) {
        setAds([])
        category = category ? category : params.category
        let title = 'Объявления'
        switch (category) {
            case 'auto':
                title += ' о продаже автомобилей'
                break
            case 'properties':
                title += ' о продаже недвижимости'
                break
            case 'services':
                title += ' об услугах'
                break
        }
        document.title = title
        setCategoryFromState(category)
        setH1(title)
    }

    return (
        <div>
            <h1>{h1}</h1>
            <div>
                <ul>
                    <li><NavLink onClick={e => defineTitle('all')} to={'/ads/category/all'} >Все</NavLink></li>
                    <li><NavLink onClick={e => defineTitle('auto')} to={'/ads/category/auto'} >Авто</NavLink></li>
                    <li><NavLink onClick={e => defineTitle('properties')} to={'/ads/category/properties'} >Недвижимость</NavLink></li>
                    <li><NavLink onClick={e => defineTitle('services')} to={'/ads/category/services'} >Услуги</NavLink></li>
                </ul>
            </div>
            <div  className={'ads-page-list'}>
                {ads.map(ad => <Ad server_host={server_host} ad={ad} key={ad._id} />)}
            </div>
            <div style={{textAlign: "center"}}>
                {showNoMore && <div>Загружены все объявления</div>}
                <button type={'button'} onClick={() => loadAds()} disabled={disabled}>Ещё</button>
            </div>
        </div>
    )
}