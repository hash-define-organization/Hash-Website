/*
class Router {

    rootDiv = null;
    host = null;
    events = null;

    constructor() {
        this.rootDiv = document.querySelector('.master-container');
        this.host = window.location.host;
        
        this.routes = {
            '/' : '',
            'events' : '',
        }

        this.events = this.manageEvents();
    }

    manageEvents() {
        window.onload = () => {this.render()};
        window.onpopstate = () => {
            this.rootDiv.innerHTML = this.routes[window.location.pathname];
        };
    }

    async render(path) {

        path = !path ? window.location.pathname : path;

        if(path === '/') {
            this.routes[path] = await this.getPage('home');
        }
        else {
            const pageData = await this.getPage(path);

            if(!pageData) {
                const page404 = await this.getPage('404');
                window.history.pushState(
                    {},
                    pathName,
                    `${pathName}`,
                  );
        
                this.rootDiv.innerHTML = page404;
                return;
            }
            else {
                this.routes[path] = pageData;
            }
        }

        this.navigation(path);
    }

    async getPage (pathName) {

        const page = `/${pathName}.html`

        try {
            const response = await fetch(page);
            return response.text();
        } catch (error) {
            console.log("Load 404 Page");
        }
    }

    navigation (pathName) {

        window.history.pushState(
            {},
            pathName,
            `${pathName}`,
          );

        this.rootDiv.innerHTML = this.routes[pathName];
    }
}

const pageRouter = new Router();
window.pageRouter = pageRouter;

*/

class Router {

    routes = null;
    globalTitle = null;
    views = null;

    constructor() {

        this.routes = setRoutes();
        this.views = setViews();
        this.globalTitle = 'Hash Define';

    }

    async render() {


    }

    setRoutes() {
        return {
            '/': {
                view: 'home',
                title: `${this.globalTitle}`,
            },
            'events': {
                view: 'events',
                title: `${this.globalTitle} - Events`,
            },
            'team': {
                view: 'team',
                title: `${this.globalTitle} - Our Team`,
            },
            'about': {
                view: 'about',
                title: `${this.globalTitle} - About Us`,
            },
            '404': {
                view: '404',
                title: `404 - Page Not Found`,
            }
        }
    }
   
    setViews() {
        let views = {};

        Object.keys(this.routes).forEach( route => {
            views[route] = '';
        });

        return views;
    }

    async getView(name) {
        try {
            const page = await fetch(`/${name}.html`);
            return page.text();
        } catch (error) {
            console.log(`${name}.html - No Such Page View Found!`);
        }
    }
};