import React, {useEffect, useState} from 'react';

const OrdersPage = ({server_host}) => {

    useState(() => {
        document.title = 'Заказы'
    }, [])
    const [orders, setOrders] = useState([])
    useEffect(loadOrders, [])

    function loadOrders() {
        fetch(server_host + '/orders//get/visible', {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }). then(data => {
            if (data.ok) {
                setOrders(data.orders)
            }
        })
    }

    function hide(item) {
        fetch(server_host + '/orders/hide', {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify({
                ...item,
                hidden: true
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json()
        }).then(data => {
            if (data.ok) {
                const updateOrders = orders.filter(order => order._id !== item._id)
                setOrders(updateOrders)
            }
        })
    }

    return (
        <div>
            <h1>Заказы</h1>
            <div>
                <table>
                    <thead>
                    <tr>
                        <td>Клиент</td>
                        <td>Продукт</td>
                        <td>Цена</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order =>
                        <tr key={order._id}>
                            <td>{order.customer}</td>
                            <td>{order.ad.title}</td>
                            <td>{order.ad.price}</td>
                            <td><button type={'button'} onClick={e => hide(order)}>скрыть</button></td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersPage;