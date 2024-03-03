import Photo from "./Photo";
import {useState} from "react";

export default function Gallery({server_host, user, file}) {

    return (
        <div className={'dashboard-gallery'}>
            {user.files.map(file => <Photo server_host={server_host} user={user} file={file} key={file} />)}
        </div>
    )

}