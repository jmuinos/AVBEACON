const Koa = require('koa');
const serve = require('koa-static');
const views = require('koa-views');
const path = require('path');

const app = new Koa();

// Determinar el puerto que alojará la aplicación web en local.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

// Middleware para servir archivos estáticos
app.use(serve(path.join(__dirname, 'public')));

// Servir archivos estáticos de Bootstrap
app.use(serve(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Configura koa-views para usar EJS
app.use(views(path.join(__dirname, 'views'), {
	extension: 'ejs'
}));

// Middleware para añadir variables comunes a todas las vistas
app.use(async (ctx, next) => {
	// Simula la lógica para determinar si el usuario está logged
	ctx.state.isUserLoggedIn = true;
	
	// Añadir la página actual a ctx.state
	ctx.state.currentPage = ctx.path === '/' ? 'home' : ctx.path.slice(1);
	
	await next();
});

// Rutas
app.use(async (ctx) => {
	const {path} = ctx;
	let pagePath = path === '/' ? 'home' : path.slice(1); // Elimina el `/` inicial para obtener el nombre de la página
	
	try {
		// Renderiza la vista con EJS y pasa el estado (isUserLoggedIn y currentPage)
		await ctx.render(pagePath, {
			isUserLoggedIn: ctx.state.isUserLoggedIn,
			currentPage: ctx.state.currentPage
		});
	} catch (error) {
		ctx.status = 404;
		ctx.body = 'Page not found';
	}
});




