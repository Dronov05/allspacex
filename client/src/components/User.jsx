import {NavLink} from "react-router-dom";

export default function User({user, server_host}) {
    return (
        <NavLink to={'/users/' + user._id} className={'user-link'}>
            <div className={'user-card'}>
                <div><b>{user.name}</b></div>
                <div>{user.username}</div>
            </div>
        </NavLink>

    )
}