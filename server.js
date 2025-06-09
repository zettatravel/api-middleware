import app from './app.js';
import {logger} from "./src/utils/logUtils.js";

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    logger.debug(`Server running on http://localhost:${PORT}`);
    logger.debug(`Environment: ${process.env.NODE_ENV}`);
});
