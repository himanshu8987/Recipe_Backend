import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, "secret", (error) => {
            if (error)
                return res.sendStatus(403);
            next();
        });
    } else {
        res.sendStatus(401);
    }
}
export default verifyToken;