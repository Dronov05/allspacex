import {useState} from "react";

export default function Photo({server_host, user, file}) {

    {console.log(user)}
    const [disabled, setDisabled] = useState(false)
    const [result, setResult] = useState('')

     function deletePhoto() {
        setDisabled(true)
         setResult('')

         fetch(server_host + "/files/delete/id/" + file._id, {
             method: 'post',
             credentials: "include",
         }).then(res => {
                return res.json()
         }).then(data => {
                 if (data.ok) {
                     setResult('Фото удалено')
                 } else  {
                     setResult('Ошибка ' + data.message)
                     setDisabled(false)
                 }
             }).catch(e => {
             setResult("Ошибка " + e)
             setDisabled(false)
         })
    }



    return (
        <div className={'photo-img'}>
            <img src={server_host + "/files/id/" + file._id}/>
            <div>
                <button type={'button'} disabled={disabled} onClick={deletePhoto}>Удалить</button> {file === user.avatar && 'Фото профиля'} {result}
            </div>
        </div>
    )
}