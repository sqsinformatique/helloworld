export function orderStateToString(state) {
    switch (state) {
        case 'to_delivery':
            return 'В доставке'
        case 'accepted':
            return 'Получен'
        case 'canceled':
            return "Отменён"
        default:
            return 'Не известное состояние'
    }
}

export function fullOrderDate(order) {
    return order.order_date + " с " + order.order_time_begin + " до " + order.order_time_end
}

