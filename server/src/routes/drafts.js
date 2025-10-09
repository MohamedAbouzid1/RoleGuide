const express = require('express');
const {
  getDrafts,
  createDraft,
  getDraft,
  updateDraft,
  patchDraft,
  deleteDraft,
  createSnapshot,
} = require('../controllers/draftsController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All draft routes require authentication
router.use(authenticateToken);

router.get('/', getDrafts);
router.post('/', createDraft);
router.get('/:id', getDraft);
router.put('/:id', updateDraft);
router.patch('/:id', patchDraft);
router.delete('/:id', deleteDraft);
router.post('/:id/snapshot', createSnapshot);

module.exports = router;
