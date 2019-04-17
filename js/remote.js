let remote = (() => {
    const BaseUrl = 'https://baas.kinvey.com/';
    const AppKey = 'kid_BJwXSvycN'; // APP KEY HERE
    const AppSecret = '89f13538abb94792bb146a991ab413f3'; // APP SECRET HERE

    function makeAuth(type) {
        return type === 'basic'
            ?  'Basic ' + btoa(AppKey + ':' + AppSecret)
            :  'Kinvey ' + sessionStorage.getItem('authtoken');
    }

    function makeRequest(method, module, endpoint, auth) {
        return {
            url: BaseUrl + module + '/' + AppKey + '/' + endpoint,
            method: method,
            headers: {
                'Authorization': makeAuth(auth)
            }
        }
    }

    function get (module, endpoint, auth) {
        return $.ajax(makeRequest('GET', module, endpoint, auth));
    }

    function post (module, endpoint, auth, data) {
        let obj = makeRequest('POST', module, endpoint, auth);
        if (data) {
            obj.data = data;
        }
        return $.ajax(obj);
    }

    function update(module, endpoint, auth, data) {
        let obj = makeRequest('PUT', module, endpoint, auth);
        obj.data = data;
        return $.ajax(obj);
    }

    function remove(module, endpoint, auth) {
        return $.ajax(makeRequest('DELETE', module, endpoint, auth));
    }

    return {
        get,
        post,
        update,
        remove
    }
})();