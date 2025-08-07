const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET = 'your-secret'; // Лучше хранить в .env
const app = express();
const router = express.Router();
const cors = require("cors");
const dotenv = require("dotenv");
const HTTP_STATUS = require("./constants/httpStatus");
const prisma = require("./config/database");
const authMiddleware = require('./authMiddleware');
dotenv.config();
app.use(cors());
app.use(express.json());

const users = []; // Временно. Замените на таблицу пользователей в БД.

router.post('/register', async (req, res) => {
  console.log('req.json', JSON.stringify(req.body, null, 2));
  const { username, password } = req.body || {};
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  res.status(201).send({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

router.get("/users/all", authMiddleware, async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - All users request hit!`);
        let { page, limit } = req.query;

        if (!page && !limit) {
            page = 1;
            limit = 5;
        }

        if (page <= 0) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send({
                success: false,
                message: "Page value must be 1 or more",
                data: null,
            });
        }

        if (limit <= 0) {
            return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).send({
                success: false,
                message: "Limit value must be 1 or more",
                data: null,
            });
        }

        const users = await prisma.user.findMany({
            skip: Number(page - 1) * Number(limit),
            take: Number(limit),
        });

        const total = await prisma.user.count();
        return res.status(HTTP_STATUS.OK).send({
            success: true,
            message: "Successfully received all users",
            data: {
                users: users,
                total: total,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal server error",
        });
    }
});

router.get(`/user/:id`, authMiddleware, async (req, res) => {
    try {
        console.log(`${new Date().toISOString()} - Single user request hit!`);
        const { id } = req.params;

        const result = await prisma.user.findFirst({ where: { id: Number(id) } });

        if (result) {
            return res.status(HTTP_STATUS.OK).send({
                success: true,
                message: `Successfully received user with id: ${id}`,
                data: result,
            });
        }
        return res.status(HTTP_STATUS.NOT_FOUND).send({
            success: false,
            message: "Could not find user",
            data: null,
        });
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal server error",
        });
    }
});

app.use("/", router);

app.listen(process.env.PORT, () => {
    console.log(`Listening to port: ${process.env.PORT}`);
});
