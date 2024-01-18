import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import getAge from "get-age"

export default function UserPage({server_host}) {

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {document.title = 'Пользователь'}, [])
    const params = useParams()

    useEffect(loadUser, [])

    function loadUser() {
        fetch(server_host + '/users/id/' + params.id, {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            setLoading(false)
            setUser(data.user)
        }).catch(e => {
            setLoading(false)
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

    function changeAvatar(file) {
        setUser({
            ...user,
            avatar: file
        })
    }

    return (
        <div>
            <div className={'user-data'}>
                {user.avatar &&
                    <div className={'user-data_left'}>
                        <img className={'photo-img'} src={server_host + "/files/id/" + user.avatar}/>
                    </div>}

                <div className={'user-data_right'}>
                    <h1>{user.name}</h1>
                    <div>{user.username}</div>
                    <div>Возраст: {getAge(user.birthday)}</div>
                    <div>{user.about}</div>
                </div>
            </div>
            <div className={'album'}>
                {user.files.map(file => <div className={'photo'}><img onClick={e => changeAvatar(file)} src={server_host + "/files/id/" + file} /></div>)}
            </div>
        </div>
    )
}