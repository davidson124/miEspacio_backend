import { Router } from "express";


const router = Router();

router.post('/', createDocumentations);
router.get('/', getAllDocumenttaios);
router.get('/:id', getDocumentationsById);
router.delete('/:id', deleteDocumentatiosById);
router.patch('/:id', upDatedocumantationsById);

export default router;