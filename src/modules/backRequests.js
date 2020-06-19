const back_url = 'https://sqsinformatique-vk-back.ngrok.io'

// Курьеры
export async function postCourierGeodata(courier_id, geodata) {
	let courierGeodata = {
		curier_id: courier_id,
		lat: geodata.lat,
		long: geodata.long,
	};
	console.log("courierGeodata", courierGeodata)

	let url = back_url + '/api/v1/curiers/geo'
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(courierGeodata)
	});
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		// получаем тело ответа
		let json = response.json();
		console.log("postCourierGeodata", json)
		return json
	}
}

export async function getCourierBySocialID(social_id) {
	let url = back_url + '/api/v1/curiers/'

	let response = await fetch(url + social_id);
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		let json = await response.json();
		console.log("getCourierBySocialID", json)
		return json.result
	}
}

export async function getCourierGeodataByCourierID (courier_id) {
	let url = back_url + '/api/v1/curiers/geo/'
	let response = await fetch(url + courier_id);
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		let json = await response.json();
		console.log("getCourierBySocialID", json)
		return json.result
	}

}

// Заказы
export async function postSearchOrdersByClientHashPhone(hash_phone) {
	let requestOrder = [
		{
			hash_telephone: hash_phone,
		}
	]
	console.log("requestOrder", requestOrder)

	let url = back_url + '/api/v1/orders/search'
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(requestOrder)
	});
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		// получаем тело ответа
		let json = await response.json();
		console.log("postSearchOrdersByClientHashPhone", json)
		return json.result
	}
}

export async function postSearchOrdersByBusinessID(business_id) {
	let requestOrder = [
		{
			business_id: business_id,
		}
	]
	console.log("requestOrder", requestOrder)

	let url = back_url + '/api/v1/orders/search'
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(requestOrder)
	});
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		// получаем тело ответа
		let json = await response.json();
		console.log("postSearchOrdersByBusinessID", json)
		return json.result
	}
}

export async function postSearchOrdersByCourierID(courier_id) {
	let requestOrder = [
		{
			curier_id: courier_id,
		}
	]
	console.log("requestOrder", requestOrder)

	let url = back_url + '/api/v1/orders/search'
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(requestOrder)
	});
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		// получаем тело ответа
		let json = await response.json();
		console.log("postSearchOrdersByCourierID", json)
		return json.result
	}
}

export async function postCreateOrder(business_id, order) {
	let createOrderRequest = {
		business_id: business_id,
		curier_id: Number(order.curier_id),
		email: order.email,
		telephone: order.phone,
		order_number: order.order_number,
		order_address: order.address,
		order_description: order.description,
		order_date: new Date(Date.parse(order.order_date)).toJSON(),
		order_time_begin: order.order_time_begin,
		order_time_end: order.order_time_end,
		order_state: 'to_delivery',
	}
	console.log(createOrderRequest)

	let url = back_url + '/api/v1/orders'
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(createOrderRequest)
	});
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		// получаем тело ответа
		let json = response.json();
		console.log("postCreateOrder", json)
		return json.result
	}
}

// Клиенты
export async function getClientBySocialID(social_id) {
	let url = back_url + '/api/v1/clients/'

	let response = await fetch(url + social_id);
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		let json = await response.json();
		console.log("getClientBySocialID", json)
		return json.result
	}
}

// Бизнес
export async function getBusinessBySocialID(social_id) {
	let url = back_url + '/api/v1/business/'

	let response = await fetch(url + social_id);
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		let json = await response.json();
		console.log("getBusinessBySocialID", json)
		return json.result
	}
}

export async function getCuriersByBusinessID(business_id) {
	let url = back_url + '/api/v1/business/curiers/'

	let response = await fetch(url + business_id);
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		let json = await response.json();
		console.log("getCuriersByBusinessID", json)
		return json.result
	}
}

export async function postCreateBindingBusinessCourier(business_id, courier_phone) {
	let bindCurier = {
		business_id: business_id,
		phone: courier_phone
	};

	console.log(bindCurier)

	let url = back_url + '/api/v1/business/bind_curier'
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(bindCurier)
	});
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		let json = response.json();
		console.log("postCreateBindingBusinessCourier", json)
		return json.result
	}
}

export async function postDeleteBindingBusinessCourier(business_id, curier_id) {
	let unbindCurier = {
		business_id: business_id,
		curier_id: curier_id
	};

	console.log(unbindCurier)

	let url = back_url + '/api/v1/business/unbind_curier'
	let response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(unbindCurier)
	});
	if (response.ok) { // если HTTP-статус в диапазоне 200-299
		let json = response.json();
		console.log("postDeleteBindingBusinessCourier", json)
		return json.result
	}
}



