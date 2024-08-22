import express from 'express';
import cors from 'cors';  // Importe o módulo cors
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();


app.use(cors({
    origin: 'http://localhost:5173'   
}));

app.use(express.json());


app.post('/usuarios', async (req, res) => {
    try {
        const { email, name, age } = req.body;

        if (!email || !name || !age) {
            return res.status(400).json({ error: 'Todos os campos (email, name, age) são obrigatórios.' });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                age
            },
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário.', details: error.message });
    }
});


app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, age } = req.body;

        if (!email || !name || !age) {
            return res.status(400).json({ error: 'Todos os campos (email, name, age) são obrigatórios.' });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { email, name, age },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário.', details: error.message });
    }
});


app.get('/usuarios', async (req, res) => {
    try {
        const { id, name, age, email } = req.query;

        console.log('Received query parameters:', req.query);

        let filters = {};

        if (name) {
            filters.name = {
                equals: name,
                mode: 'insensitive'
            };
        }

        if (age) {
            filters.age = {
                equals: age,
                mode: 'insensitive'
            };
        }

        if (email) {
            filters.email = {
                equals: email,
                mode: 'insensitive'
            };
        }

        let users;

        if (id) {
            users = await prisma.user.findUnique({
                where: { id }
            });

            if (!users) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
        } else {
            users = await prisma.user.findMany({
                where: filters
            });
        }

        console.log('Users found:', users);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar usuários.', details: error.message });
    }
});


app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        await prisma.user.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário.', details: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
