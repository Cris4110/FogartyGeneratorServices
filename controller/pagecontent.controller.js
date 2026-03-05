import PageContent from '../models/pagecontent.model.js';

export const getContent = async (req, res) => {
  try {
    const content = await PageContent.findOne({ pageName: req.params.pageName });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContent = async (req, res) => {
  try {
    const updatedContent = await PageContent.findOneAndUpdate(
      { pageName: req.params.pageName },
      { content: req.body.content, updatedAt: Date.now() },
      { new: true }
    );
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};