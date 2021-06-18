import { app } from './app';

const PORT = 8000;

const server = app.listen(PORT, () => {
	console.log(`Server listening at ${PORT}`);
});