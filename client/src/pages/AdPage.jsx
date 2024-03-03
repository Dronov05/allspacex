import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import OrderForm from "../components/OrderForm";

export default function AdPage({server_host}) {

    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [ad, setAd] = useState({})
    const [email, setEmail] = useState('')

    useEffect(loadAd, [])
    useEffect(loadEmail, [])

    function loadAd() {
        fetch(server_host + '/ads/id/' + params.id, {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            setAd(data.ad)
            setLoading(false)
        })
    }

    function loadEmail() {
        fetch(server_host + '/ads/id/' + params.id + '/contact', {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            setEmail(data.email)
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
            <h1>{ad.title}</h1>
            <div>{ad.text}</div>
            <div className={'ad-price'}>{ad.price + ' руб.'}</div>
            <div>{email}</div>
            <OrderForm server_host={server_host} ad={ad} />
            <div>{ad.images.map(img => <div className={'ad-page-image'}><img src={server_host + '/files/id/' + img._id} /></div>)}</div>
        </div>
    )
}