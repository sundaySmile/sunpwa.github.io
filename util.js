'use strict';

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('./sw.js').then(function(registration) {
			// 注册成功
			console.log('ServiceWorker registration successful with scope: ', registration);
		}).catch(function(err) {
			// 注册失败 :(
			console.log('ServiceWorker registration failed: ', err);
		});
	});
}