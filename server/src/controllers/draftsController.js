const { prisma } = require('../config/database');

const getDrafts = async (req, res) => {
  try {
    const drafts = await prisma.draft.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        overallScore: true,
        atsScore: true,
        data: true, // Include data for thumbnail generation
      },
    });

    return res.json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const createDraft = async (req, res) => {
  try {
    const { title, data } = req.body;

    const draft = await prisma.draft.create({
      data: {
        title: title || 'Mein Lebenslauf',
        data: data || {},
        userId: req.user.id,
      },
    });

    return res.status(201).json(draft);
  } catch (error) {
    console.error('Error creating draft:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getDraft = async (req, res) => {
  try {
    const { id } = req.params;

    const draft = await prisma.draft.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    return res.json(draft);
  } catch (error) {
    console.error('Error fetching draft:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, data } = req.body;

    const draft = await prisma.draft.update({
      where: {
        id,
        userId: req.user.id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(data !== undefined && { data }),
      },
    });

    return res.json(draft);
  } catch (error) {
    console.error('Error updating draft:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const patchDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { overallScore, atsScore, lastEvaluation } = req.body;

    const draft = await prisma.draft.update({
      where: {
        id,
        userId: req.user.id,
      },
      data: {
        ...(overallScore !== undefined && { overallScore }),
        ...(atsScore !== undefined && { atsScore }),
        ...(lastEvaluation !== undefined && { lastEvaluation }),
      },
    });

    return res.json(draft);
  } catch (error) {
    console.error('Error patching draft:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteDraft = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.draft.delete({
      where: {
        id,
        userId: req.user.id,
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting draft:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const createSnapshot = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    // Verify the draft belongs to the user
    const draft = await prisma.draft.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    const snapshot = await prisma.snapshot.create({
      data: {
        draftId: id,
        data: data || {},
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return res.status(201).json(snapshot);
  } catch (error) {
    console.error('Error creating snapshot:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDrafts,
  createDraft,
  getDraft,
  updateDraft,
  patchDraft,
  deleteDraft,
  createSnapshot,
};
