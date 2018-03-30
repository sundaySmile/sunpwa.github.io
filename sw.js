'use strict';

// 用于标注创建的缓存，也可以根据它来建立版本
const CACHE_NAME = "sunpwa_cache_v1.0.0";

//列举要默认缓存的静态资源，一般用于离线使用
const urlsToCache = [
	'/index.html',
	'/assets/144×144.png'
];

// self 为当前scope的上下文
self.addEventListener('install', event => {
	// event.waitUtil 用于安装成功之前执行的一些预装逻辑
	// 安装成功后 ServiceWorker 状态会从 installing 变为installed
	event.waitUtil(
		caches.open(CACHE_NAME).then(cache => {
			console.log(cache);
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('activate', event => event.waitUtil(
	Promise.all([
		// 更新客户端
		clients.claim(),
		// 清理旧版本
		caches.keys().then(cacheList => Promise.all(
			cacheList.map(cacheName => {
				if (cacheName !== CACHE_NAME) {
					caches.delete(cacheName);
				}
			})
		))
	])
));

self.addEventListener('fetch', function (event) {
	console.log('start fetch', event);
});