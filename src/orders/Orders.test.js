import axios from 'axios';
import { shallow, mount } from 'enzyme';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import Orders from './Orders';
import OrdersList from './OrdersList'
import OrdersMap from './OrdersMap'

const mockOrders = {
    data: [
        {
            "id": "5efc2fe24116fa3a7a05d1c9",
            "businessId": "Order 1",
            "address": "BROEKSTRAAT 2 1540 HERNE, BE",
            "longitude": 4.05986,
            "latitude": 50.71117
        },
        {
            "id": "5efc2fe24116fa3a7a05d1ca",
            "businessId": "Order 2",
            "address": "EDINGSESTEENWEG 152E 1541 HERNE, BE",
            "longitude": 4.03375,
            "latitude": 50.70035
        },
        {
            "id": "5efc2fe24116fa3a7a05d1cb",
            "businessId": "Order 3",
            "address": "Plaats 9 1547 BEVER, BE",
            "longitude": 3.94301,
            "latitude": 50.71729
        }
    ]
}

function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}

jest.mock('axios');

describe('<Orders />', () => {
    let wrapper;

    beforeEach(async () => {
        axios.get.mockImplementation(() => Promise.resolve(mockOrders));
        wrapper = shallow(<Orders />);

        await flushPromises();
    });

    it('should render the OrdersList and OrdersMap', () => {
        const ordersList = wrapper.find(OrdersList)
        expect(ordersList.length).toEqual(1)

        const ordersMap = wrapper.find(OrdersMap)
        expect(ordersMap.length).toEqual(1)
    });

    it('should get and set the orders upon mount', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'loadOrders');
        instance.componentDidMount();

        expect(instance.loadOrders).toHaveBeenCalledTimes(1);
    });

    it('should update the selectedOrderId upon toggle', () => {
        const selectId = 'id'
        expect(wrapper.state().selectedOrderId).toBeNull()

        wrapper.instance().toggleOrder(selectId)

        expect(wrapper.state().selectedOrderId).toEqual(selectId)
    });

    it('should set the ordersError to true', async () => {
        expect(wrapper.state().ordersError).toEqual(false)

        axios.get.mockImplementation(() => Promise.reject('error'));
        wrapper.instance().componentDidMount()
        await flushPromises();

        expect(wrapper.state().ordersError).toEqual(true)
    });
});

describe('<OrdersList />', () => {
    const createMount = (selectedOrderId, ordersError, orders = mockOrders.data) => {
        return mount(<OrdersList
            orders={orders}
            selectedOrderId={selectedOrderId}
            ordersError={ordersError}
            onToggleOrder={jest.fn()}
        />)
    }

    it('should show the list of orders', () => {
        const wrapper = createMount(null, false)
        const ordersList = wrapper.find('.orders--list-item')
        expect(ordersList.length).toEqual(3)
    });

    it('should show the businessId and orderAddress', () => {
        const wrapper = createMount(null, false)
        const compareOrder = wrapper.props().orders[0]

        const firstOrder = wrapper.first()

        expect(firstOrder.text().includes(compareOrder.businessId)).toBe(true)
        expect(firstOrder.text().includes(compareOrder.address)).toBe(true)
    });

    it('should set the errorState', () => {
        const wrapper = createMount(null, true)
        const ordersListError = wrapper.find('.orders--list-error')
        expect(ordersListError.length).toEqual(1)
    });

    it('should set the emptyState', () => {
        const wrapper = createMount(null, false, [])
        const ordersListEmpty = wrapper.find('.orders--list-empty')
        expect(ordersListEmpty.length).toEqual(1)
    });

    it('should trigger the onToggleOrder with the correct id', () => {
        const wrapper = createMount(null, false)

        const mockCallback = jest.spyOn(wrapper.props(), 'onToggleOrder');
        const ordersList = wrapper.find('.orders--list-item')

        ordersList.first().simulate('click');

        expect(mockCallback).toHaveBeenCalledTimes(1)
        expect(mockCallback).toHaveBeenCalledWith('5efc2fe24116fa3a7a05d1c9')
    });

    it('should set the last element selected', () => {
        const wrapper = createMount('5efc2fe24116fa3a7a05d1cb', false)

        const ordersList = wrapper.find('.orders--list-item')
        const lastElement = ordersList.last()
        const selectedElement = ordersList.find('.orders--list-item.selected')

        expect(lastElement).toEqual(selectedElement)
    });
});

describe('<OrdersMap />', () => {
    const createMount = (selectedOrderId, orders = mockOrders.data) => {
        return mount(<OrdersMap
            orders={orders}
            selectedOrderId={selectedOrderId}
            onToggleOrder={jest.fn()}
        />)
    }

    it('should show the MapContainer', () => {
        const wrapper = createMount(null)
        expect(wrapper.find(MapContainer).length).toEqual(1)
    });

    it('should show the MapContainer fullscreen', () => {
        const wrapper = createMount(null)
        expect(wrapper.find(MapContainer).getElement().props.style.height).toEqual('100vh')
    });

    it('should show the TileLayer', () => {
        const wrapper = createMount(null)
        expect(wrapper.find(TileLayer).length).toEqual(1)
    });

    it('should show the Polyline', () => {
        const wrapper = createMount(null)
        expect(wrapper.find(Polyline).length).toEqual(1)
    });

    it('should show the three Markers', () => {
        const wrapper = createMount(null)
        expect(wrapper.find(Marker).length).toEqual(3)
    });

    it('should show no Markers', () => {
        const wrapper = createMount(null, [])
        expect(wrapper.find(Marker).length).toEqual(0)
    });

    it('should only show markers of type unselected when no order is selected', () => {
        const wrapper = createMount(null)
        const markers = wrapper.find(Marker)

        markers.forEach(marker => {
            const alt = marker.props().icon.options.alt
            expect(alt).toEqual('unselected')
        })
    });

    it('should show a marker of type selected only for the selected order', () => {
        const selectedOrderId = '5efc2fe24116fa3a7a05d1ca'
        const wrapper = createMount(selectedOrderId)
        const markers = wrapper.find(Marker)

        expect(markers.at(1).key()).toEqual(selectedOrderId)
        expect(markers.at(1).props().icon.options.alt).toEqual('selected')
    });

    it('should trigger the onToggleOrder with the correct id', () => {
        const wrapper = createMount(null)
        const markers = wrapper.find(Marker)

        const mockCallback = jest.spyOn(wrapper.props(), 'onToggleOrder');

        const marker = markers.first()
        const markerId = marker.key()

        marker.props().eventHandlers.click()

        expect(mockCallback).toHaveBeenCalledTimes(1)
        expect(mockCallback).toHaveBeenCalledWith(markerId)
    });
});