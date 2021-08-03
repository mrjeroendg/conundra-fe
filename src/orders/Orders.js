import React, { Component } from 'react'
import { getOrders } from '../api/orders';
import OrdersMap from './OrdersMap'
import OrdersList from './OrdersList'

import './Orders.scss';

export default class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: null,
            ordersError: false,
            selectedOrderId: null
        }

        this.toggleOrder = this.toggleOrder.bind(this);
    }

    componentDidMount() {
        this.loadOrders()
    }

    loadOrders() {
        this.setState({ ordersError: false })

        getOrders()
            .then(({ data }) => this.setState({ orders: data }))
            .catch(() => this.setState({ ordersError: true }))
    }

    toggleOrder(orderId) {
        orderId = orderId !== this.state.selectedOrderId ? orderId : null
        this.setState({ selectedOrderId: orderId })
    }

    render() {
        return (
            <div className="orders">
                <OrdersList
                    orders={this.state.orders}
                    selectedOrderId={this.state.selectedOrderId}
                    ordersError={this.state.ordersError}
                    onToggleOrder={this.toggleOrder}
                />
                <OrdersMap
                    orders={this.state.orders}
                    selectedOrderId={this.state.selectedOrderId}
                    onToggleOrder={this.toggleOrder}
                />
            </div>
        )
    }
}
