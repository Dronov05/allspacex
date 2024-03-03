import React, {useState} from 'react';

const OrderForm = ({server_host, ad}) => {

    const [customer, setCustomer] = useState('')
    const [message, setMessage] = useState('')
    const [checkBoxChecked, setCheckBoxChecked] = useState(false)
    const [orderSent, setOrderSent] = useState(false)

    function changeCustomer(e) {
        setCustomer(e.target.value)
        setMessage('')
        setOrderSent(false)
    }

    async function saveOrder() {
        const res = await fetch(server_host + '/orders/save', {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify({
                customer: customer,
                ad: ad
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()
        if (data.ok) {
            setMessage('Заказ отправлен')
            setOrderSent(true)
        }
    }

    return (
        <div className={'order-form-wrapper'}>
            <h2>Оформите заказ</h2>
            {message}
            <div>
                <form action="">
                    <div>
                        <input type={'text'}
                               required={true}
                               placeholder={'email или телефон'}
                               value={customer}
                               onChange={e => changeCustomer(e)}/>
                    </div>
                    <div>
                        <input type={'checkbox'} onChange={e => setCheckBoxChecked(e.target.checked)}/> согласен с правилами
                    </div>
                    <div>
                        <button disabled={!checkBoxChecked || !customer || orderSent} type={'button'} onClick={saveOrder}>Заказать</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;