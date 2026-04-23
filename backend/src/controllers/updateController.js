const { PrismaClient } = require('@prisma/client');
const { computeStatus } = require('../utils/statusHelper');

const prisma = new PrismaClient();

// Agent: update field stage and add a note
const addUpdate = async (req, res) => {
  try {
    const { note, stage } = req.body;
    const fieldId = parseInt(req.params.id);

    // check field exists and belongs to this agent
    const field = await prisma.field.findUnique({
      where: { id: fieldId }
    });

    if (!field) return res.status(404).json({ message: 'Field not found' });

    if (field.agentId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized for this field' });
    }

    // create the update
    const update = await prisma.update.create({
      data: {
        fieldId,
        note,
        stage
      }
    });

    // update the field stage
    const updatedField = await prisma.field.update({
      where: { id: fieldId },
      data: { stage },
      include: {
        updates: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    res.status(201).json({
      update,
      field: {
        ...updatedField,
        status: computeStatus(updatedField)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Both: get all updates for a field
const getFieldUpdates = async (req, res) => {
  try {
    const fieldId = parseInt(req.params.id);

    const updates = await prisma.update.findMany({
      where: { fieldId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addUpdate, getFieldUpdates };