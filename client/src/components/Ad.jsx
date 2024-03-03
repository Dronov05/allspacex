import {NavLink} from "react-router-dom";

export default function Ad({server_host, ad}) {
    return (
        <NavLink to={'/ads/' + ad._id}>
            <div className={'ad'}>
                {(ad.images && ad.images.length > 0) &&
                <div className={'image'}>
                    <div className={'main-image'}>
                        <img src={server_host + '/files/id/' + ad.images[0]}/>
                    </div>
                </div>}
                <div className={'data'}>
                    <div className={'ad-title'}>{ad.title}</div>
                    <div className={'ad-text'}>{ad.text}</div>
                    <div className={'ad-price'}>{ad.price && ad.price + ' руб.'}</div>
                </div>
            </div>
        </NavLink>

    )
}