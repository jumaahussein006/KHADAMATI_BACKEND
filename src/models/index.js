const sequelize = require('../config/database');

// Models
const User = require('./User');
const Admin = require('./Admin');
const Customer = require('./Customer');
const Provider = require('./Provider');
const Category = require('./Category');
const Service = require('./Service');
const ServiceImage = require('./ServiceImage');
const ServiceRequest = require('./ServiceRequest');
const StatusHistory = require('./StatusHistory');
const Payment = require('./Payment');
const Review = require('./Review');
const Certificate = require('./Certificate');
const Upload = require('./Upload');
const Notification = require('./Notification');
const Address = require('./Address');
const Report = require('./Report');
const NameChangeRequest = require('./NameChangeRequest');
const Status = require('./Status');

/* =========================
   USER ASSOCIATIONS
   ========================= */
User.hasOne(Admin, { foreignKey: 'user_id', as: 'adminProfile' });
User.hasOne(Customer, { foreignKey: 'user_id', as: 'customerProfile' });
User.hasOne(Provider, { foreignKey: 'user_id', as: 'providerProfile' });

User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
User.hasMany(Upload, { foreignKey: 'user_id', as: 'uploads' });
User.hasMany(NameChangeRequest, { foreignKey: 'user_id', as: 'nameChangeRequests' });

/* =========================
   ADMIN / CUSTOMER / PROVIDER ASSOCIATIONS
   ========================= */
Admin.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Customer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Customer.hasMany(ServiceRequest, { foreignKey: 'customer_id', as: 'requests' });

Provider.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Provider.hasMany(Service, { foreignKey: 'provider_id', as: 'services' });
Provider.hasMany(ServiceRequest, { foreignKey: 'provider_id', as: 'requests' });
Provider.hasMany(Certificate, { foreignKey: 'provider_id', as: 'certificates' });

/* =========================
   CATEGORY / SERVICE ASSOCIATIONS
   ========================= */
Category.hasMany(Service, { foreignKey: 'category_id', as: 'services' });

Service.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Service.belongsTo(Provider, { foreignKey: 'provider_id', as: 'provider' });

Service.hasMany(ServiceImage, { foreignKey: 'service_id', as: 'images' });
Service.hasMany(ServiceRequest, { foreignKey: 'service_id', as: 'requests' });

ServiceImage.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });
ServiceImage.belongsTo(Provider, { foreignKey: 'provider_id', as: 'provider' });

/* =========================
   SERVICE REQUEST ASSOCIATIONS
   ========================= */
ServiceRequest.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
ServiceRequest.belongsTo(Provider, { foreignKey: 'provider_id', as: 'provider' });
ServiceRequest.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

ServiceRequest.hasMany(Payment, { foreignKey: 'request_id', as: 'payments' });
Payment.belongsTo(ServiceRequest, { foreignKey: 'request_id', as: 'request' });

ServiceRequest.hasMany(Review, { foreignKey: 'request_id', as: 'reviews' });
Review.belongsTo(ServiceRequest, { foreignKey: 'request_id', as: 'request' });

/* =========================
   STATUS HISTORY / STATUS ASSOCIATIONS
   ========================= */
ServiceRequest.hasMany(StatusHistory, { foreignKey: 'service_request_id', as: 'history' });
StatusHistory.belongsTo(ServiceRequest, { foreignKey: 'service_request_id', as: 'request' });

StatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'changedByUser' });

// Optional: only if you use Status model
if (Status) {
   StatusHistory.belongsTo(Status, { foreignKey: 'old_status_id', as: 'oldStatus' });
   StatusHistory.belongsTo(Status, { foreignKey: 'new_status_id', as: 'newStatus' });
}

/* =========================
   CERTIFICATE / NOTIFICATION / ADDRESS / UPLOAD ASSOCIATIONS
   ========================= */
Certificate.belongsTo(Provider, { foreignKey: 'provider_id', as: 'provider' });

Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Upload.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

/* =========================
   REPORT / NAME CHANGE ASSOCIATIONS
   ========================= */
Report.belongsTo(User, { foreignKey: 'user_id', as: 'reporter' });
Report.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });

NameChangeRequest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
NameChangeRequest.belongsTo(Admin, { foreignKey: 'reviewed_by', as: 'reviewedByAdmin' });

module.exports = {
   sequelize,
   User,
   Admin,
   Customer,
   Provider,
   Category,
   Service,
   ServiceImage,
   ServiceRequest,
   StatusHistory,
   Payment,
   Review,
   Certificate,
   Upload,
   Notification,
   Address,
   Report,
   NameChangeRequest,
   Status,
};
