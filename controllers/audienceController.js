const AudienceSegment = require('../models/AudienceSegment');
const Customer = require('../models/Customer');

exports.createAudience = async (req, res) => {
    try {
        const { criteria, name } = req.body;

        // Validate that criteria is an array and has the correct structure
        if (!Array.isArray(criteria) || criteria.length === 0) {
            return res.status(400).json({ error: 'Invalid criteria format. Criteria must be a non-empty array.' });
        }

        // Build a complex query with AND/OR logic
        const query = buildComplexQueryFromCriteria(criteria);

        // Calculate audience size based on the constructed query
        const size = await Customer.countDocuments(query);

        // Create and save the new audience segment
        const newAudience = new AudienceSegment({ name, criteria, size });
        await newAudience.save();

        res.status(201).json({
            message: 'Audience segment created successfully',
            audience: newAudience
        });
    } catch (err) {
        console.error('Error creating audience segment:', err);
        res.status(400).json({ error: err.message });
    }
};
// Fetch all audience segments
exports.getAllAudiences = async (req, res) => {
    try {
        const audiences = await AudienceSegment.find();
        res.status(200).json(audiences);
    } catch (err) {
        console.error('Error fetching audience segments:', err);
        res.status(500).json({ error: err.message });
    }
};


// Helper function to build a MongoDB query from advanced criteria with AND/OR logic
function buildComplexQueryFromCriteria(criteria) {
    const query = { $and: [] };

    criteria.forEach(conditionGroup => {
        if (Array.isArray(conditionGroup.conditions) && conditionGroup.conditions.length > 0) {
            const condition = { $or: [] };

            conditionGroup.conditions.forEach(field => {
                if (field.operator && field.value !== undefined) {
                    const singleCondition = {};
                    singleCondition[field.field] = { [`$${field.operator}`]: field.value };
                    condition.$or.push(singleCondition);
                }
            });

            if (condition.$or.length > 0) {
                query.$and.push(condition);
            }
        } else {
            console.warn('Invalid or empty conditions array in conditionGroup:', conditionGroup);
        }
    });

    return query.$and.length > 0 ? query : {};
}


// Example criteria format:
// [
//   {
//     conditions: [
//       { field: 'totalSpending', operator: 'gt', value: 10000 },
//       { field: 'visits', operator: 'lte', value: 3 }
//     ],
//     logic: 'OR' // Represents that this group is processed as an OR block
//   },
//   {
//     conditions: [
//       { field: 'lastVisit', operator: 'lt', value: new Date(new Date().setMonth(new Date().getMonth() - 3)) }
//     ],
//     logic: 'AND' // Represents that this group is processed as an AND block
//   }
// ]
