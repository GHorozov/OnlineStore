let service = (() => {

    function getAllItems(){
        let endPoint = 'items?query={}&sort={"_kmd.ect": -1}';

        return remote.get('appdata', endPoint,'kinvey');
    }

    function createItem(title, description, pictureUrl, price) {
        let endPoint = 'items';
        let currentDate = new Date()
            .toJSON()
            .slice(0,10)
            .replace(/-/g,'/');

        let data = {
            "title": title,
            "seller": sessionStorage.getItem('username'),
            "description":description,
            "pictureUrl": pictureUrl,
            "isAuthor": true,
            "price": Number(price),
            "date": currentDate
        };

        return remote.post('appdata', endPoint, 'kinvey', data);
    }

    function getItemById(itemId){
        let endPoint = `items/${itemId}`;

        return remote.get('appdata', endPoint, 'kinvey');
    }

    function editItem(itemId, title, description, pictureUrl, price) {
        let endPoint = `items/${itemId}`;
        let currentDate = new Date()
            .toJSON()
            .slice(0,10)
            .replace(/-/g,'/');

        let data = {
            "title": title,
            "seller": sessionStorage.getItem('username'),
            "description":description,
            "pictureUrl": pictureUrl,
            "isAuthor": true,
            "price": Number(price),
            "date": currentDate
        };

        return remote.update('appdata', endPoint, 'kinvey', data);
    }

    function deleteItem(itemId) {
        let endPoint = `items/${itemId}`;

        return remote.remove('appdata', endPoint, 'kinvey');
    }

    function getMyItems(username){
        let endPoint = `items?query={"seller":"${username}"}&sort={"_kmd.ect": -1}`;

        return remote.get('appdata', endPoint, 'kinvey');
    }

    return {
        getAllItems,
        createItem,
        getItemById,
        editItem,
        deleteItem,
        getMyItems
    }
})();