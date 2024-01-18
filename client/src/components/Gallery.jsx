import Photo from "./Photo";
import {useState} from "react";

export default function Gallery({server_host, user, file}) {

    return (
        <div>
            <h2>Галлерея</h2>
            {user.files.map(file => <Photo server_host={server_host} user={user} file={file} />)}
        </div>
    )
}