const serializeUser = (user) => {
    if (!user) return null;
    const data = user.toJSON ? user.toJSON() : user;

    return {
        user_id: data.userId,
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        created_at: data.createdAt,
    };
};

const serializeProvider = (provider) => {
    if (!provider) return null;
    const data = provider.toJSON ? provider.toJSON() : provider;

    return {
        provider_id: data.providerId,
        user_id: data.userId,
        experience_years: data.experienceYears,
        specialization: data.specialization,
        rating: data.rating,
        total_reviews: data.totalReviews,
        is_verified: data.isVerified,
        verification_document: data.verificationDocument,
        user: data.user ? serializeUser(data.user) : null,
    };
};

const serializeCustomer = (customer) => {
    if (!customer) return null;
    const data = customer.toJSON ? customer.toJSON() : customer;

    return {
        customer_id: data.customerId,
        user_id: data.userId,
        user: data.user ? serializeUser(data.user) : null,
    };
};

module.exports = {
    serializeUser,
    serializeProvider,
    serializeCustomer,
};
