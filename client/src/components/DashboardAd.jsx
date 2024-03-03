import {NavLink} from "react-router-dom";

export default function DashboardAd({ad}) {
    return (
        <NavLink to={'/ads/edit/' + ad._id} >
            <div className={ad.published ? 'ad published' : 'ad'}>
                <div className={'ad-title'}>{ad.title}</div>
                <div className={'ad-text'}>{ad.text}</div>
                <div className={'ad-price'}>{ad.price ? ad.price + ' руб.' : 'цена не указана'}</div>
                <div className={'ad-photos-count'}>{ad.images ? ad.images.length : 0} фото</div>
            </div>
        </NavLink>

    )
}