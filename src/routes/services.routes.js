import { Router } from "express";
import { createService, deleteService, getAllServices, getServiceById, patchService } from "../controllers/service.controller.js";

const router=Router()

router.post('/', createService);
router.get('/', getAllServices);
router.get('/:serviceId', getServiceById);
router.delete('/:serviceId', deleteService);
router.patch('/:serviceId', patchService)


export default router