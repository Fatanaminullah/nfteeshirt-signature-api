module.exports = function (Sequelize, DataTypes) {
  var Model = Sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        field: "id",
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      nonce: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: () => Math.floor(Math.random() * 1000000),
      },
      wallet_address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { args: true, msg: "Wallet Address must be unique" },
        validate: { isLowercase: true },
      },
    },
    { timestamps: false, freezeTableName: true }
  );

  return Model;
};
