import express from 'express';
import { MemberController } from '../controllers/memberController.js';

const router = express.Router();

// GET /api/members
router.get('/', MemberController.getAllMembers);

// POST /api/members
router.post('/', MemberController.registerMember);
// DELETE /api/members/:id
router.delete('/:id', MemberController.deleteMember);   
// PUT /api/members/:id
router.put('/:id', MemberController.updateMember);

export default router;
