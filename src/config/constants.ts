export const constants = {
    PORT : process.env.PORT || 5000,
    MONGO_URI : process.env.MONGO_URI || "mongodb://127.0.0.1:27017/",
    JWT_SECRET : process.env.JWT_SECRET || "jwt_secret_dev"
}