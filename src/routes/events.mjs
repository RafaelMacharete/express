import express from 'express';
import { prisma } from '../prismaClient.mjs';
import slugify from 'slugify';

const router = express.Router();

router.post('/', async (request, response) => {
    try {
        const { title, details, maximumAttendees } = request.body;

        if (!title) {
            return response.status(400).send({ err: "Title is required!" });
        }

        const slug = slugify(title, { lower: true })

        const event = await prisma.event.create({
            data: {
                title,
                details,
                slug,
                maximumAttendees: maximumAttendees ? parseInt(maximumAttendees) : null,
            },
        });

        response.status(201).send(event);
    } catch (err) {
        console.log(err);
        
        if (err.code === "P2002") {
            // Duplicated slug
            console.log(234);
            
            return response.status(409).send({ err: "An event with this slug already exists!" });
        }
        response.send(500).send({ err: "Internal server error" })
    }
})

export default router;