const Company = require('../models/Company');
const MatchScore = require('../models/MatchScore');
const Status = require('../models/Status');

// @desc    Get all companies with match scores and status
// @route   GET /api/accounts
// @access  Private
const getAccounts = async (req, res) => {
  try {
    const companies = await Company.find({});
    const accounts = await Promise.all(companies.map(async (company) => {
      const matchScore = await MatchScore.findOne({ company: company._id });
      const status = await Status.findOne({ 
        company: company._id, 
        user: req.user._id 
      });

      return {
        id: company._id,
        name: company.name,
        domain: company.domain,
        industry: company.industry,
        employeeCount: company.employeeCount,
        revenue: company.revenue,
        matchScore: matchScore ? matchScore.score : 0,
        status: status ? status.status : 'Not Target',
        lastUpdated: status ? status.updatedAt : company.createdAt
      };
    }));

    res.json({
      data: accounts,
      pagination: {
        page: 1,
        limit: accounts.length,
        total: accounts.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update company status
// @route   POST /api/accounts/:id/status
// @access  Private
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const companyId = req.params.id;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const validStatuses = ['Target', 'Not Target', 'Researching', 'Contacted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status value',
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    let statusRecord = await Status.findOne({ 
      company: companyId, 
      user: req.user._id 
    });

    if (statusRecord) {
      statusRecord.status = status;
      statusRecord.updatedAt = Date.now();
      await statusRecord.save();
    } else {
      statusRecord = await Status.create({
        company: companyId,
        user: req.user._id,
        status
      });
    }

    res.json({ 
      message: 'Status updated successfully',
      data: {
        company_id: companyId,
        new_status: status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getAccounts, updateStatus };