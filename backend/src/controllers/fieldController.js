const { PrismaClient } = require('@prisma/client');
const { computeStatus } = require('../utils/statusHelper');

const prisma = new PrismaClient();

// Admin: get all fields
const getAllFields = async (req, res) => {
  try {
    const fields = await prisma.field.findMany({
      include: {
        agent: { select: { id: true, name: true, email: true } },
        updates: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    });

    const fieldsWithStatus = fields.map(field => ({
      ...field,
      status: computeStatus(field)
    }));

    res.json(fieldsWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Agent: get assigned fields
const getMyFields = async (req, res) => {
  try {
    const fields = await prisma.field.findMany({
      where: { agentId: req.user.id },
      include: {
        updates: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    });

    const fieldsWithStatus = fields.map(field => ({
      ...field,
      status: computeStatus(field)
    }));

    res.json(fieldsWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: create a field
const createField = async (req, res) => {
  try {
    const { name, cropType, plantingDate, agentId } = req.body;

    const field = await prisma.field.create({
      data: {
        name,
        cropType,
        plantingDate: new Date(plantingDate),
        agentId: parseInt(agentId)
      },
      include: {
        agent: { select: { id: true, name: true, email: true } }
      }
    });

    res.status(201).json(field);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: get all agents
const getAllAgents = async (req, res) => {
  try {
    const agents = await prisma.user.findMany({
      where: { role: 'AGENT' },
      select: { id: true, name: true, email: true }
    });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllFields, getMyFields, createField, getAllAgents };