const { Certificate, Provider } = require('../models');
const { successResponse, errorResponse } = require('../utils/response.util');

// Get certificates by provider
exports.getCertificatesByProvider = async (req, res, next) => {
    try {
        const { providerId } = req.params;

        const certificates = await Certificate.findAll({
            where: { providerId },
            attributes: ['certificateId', 'providerId', 'image', 'issueDate'],
            order: [['issueDate', 'DESC']]
        });

        const result = certificates.map(cert => {
            const data = cert.toJSON();
            return {
                certificate_id: data.certificateId,
                provider_id: data.providerId,
                image: data.image,
                issue_date: data.issueDate
            };
        });

        return successResponse(res, result, 'Certificates retrieved successfully');
    } catch (error) {
        next(error);
    }
};

// Create certificate (provider only)
exports.createCertificate = async (req, res, next) => {
    try {
        const { issue_date } = req.body;

        // Reject if description or title fields are present
        if (req.body.title || req.body.description || req.body.title_ar || req.body.title_en || req.body.description_ar || req.body.description_en) {
            return errorResponse(res, 'Invalid fields. Certificate only accepts image and issue_date.', 400);
        }

        const provider = await Provider.findOne({ where: { userId: req.user.userId } });
        if (!provider) {
            return errorResponse(res, 'Provider profile not found.', 404);
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const certificate = await Certificate.create({
            providerId: provider.providerId,
            image: imageUrl,
            issueDate: issue_date
        });

        const data = certificate.toJSON();
        const response = {
            certificate_id: data.certificateId,
            provider_id: data.providerId,
            image: data.image,
            issue_date: data.issueDate
        };

        return successResponse(res, response, 'Certificate created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// Delete certificate (provider owner only)
exports.deleteCertificate = async (req, res, next) => {
    try {
        const { id } = req.params;

        const certificate = await Certificate.findByPk(id);
        if (!certificate) {
            return errorResponse(res, 'Certificate not found.', 404);
        }

        const provider = await Provider.findOne({ where: { userId: req.user.userId } });

        if (certificate.providerId !== provider?.providerId && req.user.role !== 'admin') {
            return errorResponse(res, 'Unauthorized to delete this certificate.', 403);
        }

        await certificate.destroy();
        return successResponse(res, null, 'Certificate deleted successfully');
    } catch (error) {
        next(error);
    }
};
