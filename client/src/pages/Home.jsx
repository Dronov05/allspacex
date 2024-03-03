import {useEffect, useState} from "react";

export default function Home() {

    useEffect(() => {document.title = 'Главная'}, [])

    return (
        <div>
                <h1>
                    Главная
                </h1>
        </div>
    )
}