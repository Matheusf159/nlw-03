import { Router } from 'express'
import multer from 'multer'

import uploadConfig from './config/upload'
import OrphanagesController from './controllers/OrphanagesController'

const routes = Router()
const upload = multer(uploadConfig)

routes.get('/orphanages',OrphanagesController.index) // listar orfanatos
routes.get('/orphanages/:id',OrphanagesController.show) // detalhe do orfanato 
routes.post('/orphanages', upload.array('images'), OrphanagesController.create) // criar orfanatos

export default routes;