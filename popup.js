document.addEventListener('DOMContentLoaded', () => {
	chrome.storage.local.get(['greeting'], (result) => {
	  console.log('Greeting currently is ' + result.greeting);
	});
  });  