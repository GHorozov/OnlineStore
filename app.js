$(() => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get("index.html", loadHomeScreen);

        this.get("#/home", loadHomeScreen);

        this.get("#/register", function (ctx) {
            ctx.loadPartials({
                navigation: 'templates/common/navigation.hbs',
                footer: 'templates/common/footer.hbs'
            }).then(function () {
                this.partial('templates/welcomePage/register.hbs')
            });
        });

        this.post("#/register", function (ctx) {
            let username = ctx.params["username"];
            let password = ctx.params["password"];
            let repPassword = ctx.params["repeatPass"];

            if (!/^[A-Za-z]{3,}$/.test(username)) {
                notify.showError("Username shouldn't be less than 3 characters!")
            } else if (!/^[A-Za-z\d]{6,}$/.test(password)) {
                notify.showError("Password shouldn't be less than 6 characters!")
            } else if (password !== repPassword) {
                notify.showError("Passwords mismatch!")
            } else {
                auth.register(username, password)
                    .then((user) => {
                        auth.saveSession(user);
                        notify.showInfo("User registration successful.");
                        ctx.redirect("#/allItems");
                    })
                    .catch(notify.handleError);
            }
        });

        this.get("#/login", function (ctx) {
            ctx.loadPartials({
                navigation: 'templates/common/navigation.hbs',
                footer: 'templates/common/footer.hbs'
            }).then(function () {
                this.partial('templates/welcomePage/login.hbs')
            });
        });

        this.post("#/login", function (ctx) {
            let username = ctx.params["username"];
            let password = ctx.params["password"];

            if (!/^[A-Za-z]{3,}$/.test(username)) {
                notify.showError("Username shouldn't be less than 3 characters!")
            } else if (!/^[A-Za-z\d]{6,}$/.test(password)) {
                notify.showError("Password shouldn't be less than 6 characters!")
            } else {
                auth.login(username, password)
                    .then((user) => {
                        auth.saveSession(user);
                        ctx.isAuth = auth.isAuth();
                        ctx.username = username;

                        notify.showInfo("Login successful.");
                        ctx.redirect("#/allItems");
                    })
                    .catch(notify.handleError);
            }
        });

        this.get("#/logout", function (ctx) {
            auth.logout()
                .then((res) => {
                    sessionStorage.clear();
                    notify.showInfo("Logout successful.");
                    ctx.redirect("#/index.html");
                })
                .catch(notify.handleError);
        });

        this.get("#/allItems", function (ctx) {
            checkIsAuth(ctx);
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            let userId = sessionStorage.getItem('userId');

            service.getAllItems().then(res => {
                res.forEach(x => {
                    x.isAuthor = (x._acl.creator === userId)
                });

                ctx.items = res;

                ctx.loadPartials({
                    navigation: 'templates/common/navigation.hbs',
                    footer: 'templates/common/footer.hbs',
                    item: 'templates/itemsPage/item.hbs'
                }).then(function () {
                    this.partial('templates/itemsPage/allItems.hbs')
                });
            }).catch(notify.handleError);
        });

        this.get("#/createItem", function (ctx) {
            checkIsAuth(ctx);
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');

            ctx.loadPartials({
                navigation: 'templates/common/navigation.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/createPage/create.hbs')
            });
        });

        this.post("#/createItem", function(ctx){
            checkIsAuth(ctx);
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            let userId = sessionStorage.getItem('userId');

            let title = ctx.params.title;
            let description = ctx.params.description;
            let pictureUrl = ctx.params.pictureUrl;
            let price = ctx.params.price;

            if(title.length > 33){
                notify.showError("Title is too long");
            }else if(description.length < 21 || description.length > 450){
                notify.showError("Description can be minimum 30 symbols and maximum 450 symbols.");
            }else if(pictureUrl.length === 0){
                notify.showError("You must add picture URL");
            }else if(Number(price) < 0 ){
                notify.showError("Price cannot be negative.");
            }else{

                service.createItem(title, description, pictureUrl, price)
                    .then(res =>{
                        notify.showInfo(`Item ${title} created.`);
                        ctx.redirect("#/allItems");
                    }).catch(notify.handleError);
            }
        });

        this.get("#/edit/:id", function (ctx) {
            checkIsAuth(ctx);
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            let itemId = ctx.params.id;

            service.getItemById(itemId)
                .then( res => {
                    ctx.itemId = itemId;
                    ctx.item = res;
                    ctx.loadPartials({
                        navigation: 'templates/common/navigation.hbs',
                        footer: 'templates/common/footer.hbs',
                    }).then(function () {
                        this.partial('templates/itemsPage/edit.hbs')
                    })
                }).catch(notify.handleError);
        });

        this.post("#/edit/:id", function (ctx) {
            checkIsAuth(ctx);
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            let itemId = ctx.params.id;

            let title = ctx.params.title;
            let description = ctx.params.description;
            let pictureUrl = ctx.params.pictureUrl;
            let price = ctx.params.price;

            if(title.length > 33){
                notify.showError("Title is too long");
            }else if(description.length < 21 || description.length > 450){
                notify.showError("Description can be minimum 30 symbols and maximum 450 symbols.");
            }else if(pictureUrl.length === 0){
                notify.showError("You must add picture URL");
            }else if(Number(price) < 0 ){
                notify.showError("Price cannot be negative.");
            }else {
                service.editItem(itemId, title, description, pictureUrl, price)
                    .then(res => {
                        notify.showInfo(`Item ${title} updated.`)
                        ctx.redirect("#/allItems");
                    }).catch(notify.handleError);
            }
        });

        this.get("#/delete/:id", function (ctx) {
            checkIsAuth(ctx);
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            let itemId = ctx.params.id;

            service.deleteItem(itemId)
                .then(res => {
                    notify.showInfo(`Item ${res.title} deleted.`);
                    ctx.redirect("#/allItems");
                }).catch(notify.handleError)
        });

        this.get("#/details/:id", function (ctx) {
            checkIsAuth(ctx);
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            let itemId = ctx.params.id;

            service.getItemById(itemId)
                .then(res => {
                    ctx.isAuthor = (res._acl.creator === sessionStorage.getItem('userId'));
                    ctx.itemId = itemId;
                    ctx.date = res.date;
                    ctx.item = res;
                    ctx.loadPartials({
                        navigation: 'templates/common/navigation.hbs',
                        footer: 'templates/common/footer.hbs',
                    }).then(function () {
                        this.partial('templates/itemsPage/details.hbs')
                    })
                }).catch(notify.handleError)
        });

        this.get("#/myItems", function (ctx) {
            checkIsAuth(ctx);
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            let username = sessionStorage.getItem("username");

            service.getMyItems(username)
                .then(res =>{
                    ctx.myItems = res;
                    ctx.loadPartials({
                        navigation: 'templates/common/navigation.hbs',
                        footer: 'templates/common/footer.hbs',
                        item: 'templates/myItemsPage/item.hbs'
                    }).then(function () {
                        this.partial('templates/myItemsPage/myItems.hbs')
                    })
                }).catch(notify.handleError);
        });

        //Helper functions
        //-----------------------------------------------------------------------------------------------------------------------------
        function loadHomeScreen(ctx) {
            if (!auth.isAuth()) {
                ctx.loadPartials({
                    navigation: 'templates/common/navigation.hbs',
                    footer: 'templates/common/footer.hbs'
                }).then(function () {
                    this.partial('templates/welcomePage/welcome.hbs')
                })
            } else {
                ctx.redirect('#/allItems');//to see where to redirect
            }
        }

        function checkIsAuth(ctx) {
            if(!auth.isAuth()){
                ctx.redirect('index.html');
            }
        }
    });

    app.run();
});


