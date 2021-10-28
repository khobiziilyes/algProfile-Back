const { Sequelize, Model, DataTypes } = require("sequelize");

// const sequelize = new Sequelize("alg_auth", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

const sequelize = new Sequelize('postgres://postgres:123456@localhost:5432/postgres');

(async () => {
  await sequelize.sync();
})();

class User extends Model {}
User.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    password: DataTypes.STRING,
    issuing_auth: DataTypes.STRING,
    release_date: DataTypes.STRING,
    expire_date: DataTypes.STRING,
    name: DataTypes.STRING,
    birthday: DataTypes.STRING,
    blood_type: DataTypes.STRING,
    sex: DataTypes.STRING,
    place_of_birth: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);

module.exports = { User, sequelize };
