export const config = {
    app: {
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        port: Number(process.env.PORT) || 3000,
        env: process.env.NODE_ENV || "development",
    },
};