import express from 'express';
import {
  getRules,
  getRuleById,
  createRule,
  updateRule,
  toggleRuleStatus,
  deleteRule,
  matchRuleForInstrument,
  evaluateInspectionTest,
  submitInspection
} from '../controllers/ruleController.js';

const router = express.Router();

// Rule matching and simulation (Public / Officer)
router.get('/match', matchRuleForInstrument);
router.post('/evaluate', evaluateInspectionTest);
router.post('/submit-inspection', submitInspection);

// Rules CRUD
router.get('/', getRules);
router.get('/:id', getRuleById);
router.post('/', createRule);
router.put('/:id', updateRule);
router.patch('/:id/status', toggleRuleStatus);
router.delete('/:id', deleteRule);

export default router;
