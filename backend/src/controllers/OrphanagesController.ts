import { Request, Response } from 'express'
import { getRepository } from 'typeorm' // para inserir os dados no banco de dados
import orphanageView from '../views/orphanages_view'
import * as Yup from 'yup'

import Ophanage from '../models/Orphanage'// criar orfanatos

export default {
    // listar os orfanatos
    async index(request: Request, response: Response){
        const orphanagesRepository = getRepository(Ophanage)

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        })

        return response.json(orphanageView.renderMany(orphanages))
    },
    
    // detalhe do orfanato
    async show(request: Request, response: Response){
        const { id } = request.params

        const orphanagesRepository = getRepository(Ophanage)

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        })

        return response.json(orphanageView.render(orphanage))
    },

    // criação de orfanatos
    async create(request: Request, response: Response){
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = request.body
    
        const orphanagesRepository = getRepository(Ophanage)

        const requestImages = request.files as Express.Multer.File[]

        const images = requestImages.map(image => {
            return { path: image.filename }
        })
        
        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            }))
        })

        await schema.validate(data, {
            abortEarly: false
        })

        const orphanage = orphanagesRepository.create(data) // cria no banco
    
        await orphanagesRepository.save(orphanage) // salva no banco
    
        return response.status(201).json(orphanage)
    }
}