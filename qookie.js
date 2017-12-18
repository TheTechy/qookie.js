/*
	qookie
	Copyright(c) 2017 George Duff
	MIT Licensed

	Include as a standard node lib
	const qookie = require('./qookie');


	//** Set a cookie
	// Arry of objects [name, value] min
	qookie.setCookie(response, [
		{
			name: 	'uuid',
			value: 	'',
			expires: 0
		},{
			name:	'customerID',
			value:	'',
			expires: 0
		}
	]);



	getSingleCookie
	@description - Retrieves a single cookie value.
	@param {request} request - Node.js request object.
	@param {cookieName} string - search string.
	@returns {string} null / string - String containing requested cookie value or null if not found.
*/
function getSingleCookie(request, cookieName) {
	var list = {}, rc = request.headers.cookie, result = null;
	rc && rc.split(';').forEach(function(cookie) {
		var parts = cookie.split('=');
		if(parts[0].trim() == cookieName)
			result = decodeURI(parts[1]);
	});
	return result;
};

/*
	getAllCookies
	@description - Returns all cookies from request object.
	@param {request} request - Node.js request object.
	@returns {object} object - Object containing all request object cookies.
*/
function getAllCookies(request) {
	var list = {}, rc = request.headers.cookie;
	rc && rc.split(';').forEach(function(cookie) {
		var parts = cookie.split('=');
		list[decodeURI(parts.shift().trim())] = decodeURI(parts.join('='));
		//list[decodeURI(parts[0].trim())] = decodeURI(parts.slice(1).join('='))
	});
	return list;
};

/*
	setCookie
	@description - Sets single or multiple cookies from an array.
	@param {response} response - Node.js response object.
	@param {cookies} array - Array of objects containing cookie data.
*/
//** Base64 options atob, btoa? */
function setCookie(res, cookies) {
	console.log(typeof cookies)
	var cookiesArr = [];
	for(var i=0; i<cookies.length; i++) {
		var currentCookie = cookies[i];

		if(!currentCookie['name'])
			throw new Error('Error: Cookie name not set');
		else if(!currentCookie['value'])
			throw new Error('Error: Cookie value not set');

		var cookieStr = encodeURIComponent(currentCookie['name']) + '=' + encodeURIComponent(currentCookie['value']);

		if(currentCookie['expires'])
			cookieStr += '; expires=' + new Date(new Date().getTime() + (1000 * 60 * currentCookie['expires'])).toUTCString();
			// cookieStr += '; expires=' + new Date(new Date().getTime() + (1000 * 60 * currentCookie['expires'])).toLocaleString();

		if(currentCookie['maxage'])
			cookieStr += '; Max-Age=' + currentCookie['maxage'];

		if(currentCookie['httponly'] && currentCookie['httponly'] == true)
			cookieStr += '; HttpOnly'

		if(currentCookie['secure'] && currentCookie['secure'] == true)	
			cookieStr += '; Secure';

		if(currentCookie['samesite']){
			if(currentCookie['samesite'] == 'strict')
				cookieStr += '; SameSite=Strict';
			else if(currentCookie['samesite'] == 'lax')
				cookieStr += '; SameSite=Lax';
		};

		//** Not currently working **/
		if(currentCookie['path'])
			cookieStr += '; Path=' + currentCookie['path'];

		//** Not working **/
		if(currentCookie['domain'])
			cookieStr += '; Domain=' + currentCookie['domain'];

		cookiesArr.push(cookieStr);
	};

	res.setHeader('Set-Cookie', cookiesArr);
};

/*
	deleteCookie
	@description - Deletes a single cookie.
	@param {res} response - Node.js response object.
	@param {cookie} string - String with the cookie name.
*/
function deleteCookie(res, cookie) {
	var cookiesArr = [];
	var currDateTime = new Date();
	currDateTime.setHours(currDateTime.getHours() - 2);
	currDateTime = currDateTime.toUTCString();

	var cookieStr = encodeURIComponent(cookie) + '=' + encodeURIComponent('');
	cookieStr += '; expires=' + currDateTime;

	res.setHeader('Set-Cookie', cookieStr);
};

module.exports = {
	setCookie: setCookie,
	getSingleCookie: getSingleCookie,
	getAllCookies: getAllCookies,
	deleteCookie: deleteCookie
};
