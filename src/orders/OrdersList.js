import React from 'react'

export default function OrdersList({ orders, selectedOrderId, ordersError, onToggleOrder }) {
    const listItemClass = orderId => {
        return `orders--list-item ${orderId === selectedOrderId ? 'selected' : ''}`
    }

    const scrollContainer = activeEl => {
        if (activeEl) {
            const parentEl = activeEl.parentElement
            const eleTop = activeEl.offsetTop;
            const eleBottom = eleTop + activeEl.clientHeight;
            const containerTop = parentEl.scrollTop;
            const containerBottom = containerTop + parentEl.clientHeight;

            const isVisible = (eleTop >= containerTop && eleBottom <= containerBottom)
            if (!isVisible) activeEl.scrollIntoView()
        }
    }

    const errorState = <p className="orders--list-error">Something went wrong while trying to load your orders. Please try again later.</p>
    const emptyState = <p className="orders--list-empty">No results found.</p>

    return (
        <div className="orders--list">
            {
                ordersError
                    ? errorState
                    : orders?.length === 0
                        ? emptyState
                        : orders?.map(order => {
                            return <div
                                key={order.id}
                                className={listItemClass(order.id)}
                                onClick={() => onToggleOrder(order.id)}
                                ref={el => order.id === selectedOrderId && scrollContainer(el)}
                            >
                                <p>{order.businessId}</p>
                                <p className="address">{order.address}</p>
                            </div>
                        })
            }
        </div>
    )
}

